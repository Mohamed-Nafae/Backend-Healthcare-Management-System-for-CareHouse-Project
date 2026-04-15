const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const handleLogin = async (req, res) => {
  const cookies = req.cookies;
  console.log(`cookies available at login : ${JSON.stringify(cookies)}`);
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "password and email are required." });
  }

  try {
    const response = await axios.get(
      `http://127.0.0.1:5003/api/patients/query?email=${email}`
    );
    const foundUser = response.data;
    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);
    if (match) {
      const role = foundUser.role_patient;
      //create JWTs
      const accessToken = jwt.sign(
        {
          _id: foundUser._id,
          email_address: foundUser.email_address,
          role: role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" } // 10m
      );
      const newRefreshToken = jwt.sign(
        { _id: foundUser._id },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" } // 1d
      );

      const newRefreshTokenArray = !cookies?.jwt
        ? !foundUser?.refreshToken
          ? []
          : foundUser.refreshToken
        : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);
      if (cookies?.jwt) res.clearCookie("jwt", { httpOnly: true });

      // saving refresh token with current user
      foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
      try {
        await axios.put(
          `http://127.0.0.1:5003/api/patients/${foundUser._id}`,
          {
            refreshToken: [...foundUser.refreshToken],
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          maxAge: 24 * 60 * 60 * 1000, // add secure opption for https
        });
        res.status(200).json({ accessToken: accessToken, id: foundUser._id });
      } catch (err) {
        if (!err.response?.status) return res.sendStatus(500);
        return res.status(err.response.status).json(err.response.data);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    if (err.response?.status === 404)
      return res.sendStatus(401); // Unauthorized
    else return res.sendStatus(500);
  }
};

const handleLogout = (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //its ok, but No content to sent back
  }
  const refreshToken = cookies.jwt;

  //Is refreshToken in db ?
  axios
    .get(
      `http://127.0.0.1:5003/api/patients/query?refreshToken=${refreshToken}`
    )
    .then(async (response) => {
      const foundUser = response.data;
      // Delete refershToken in db
      foundUser.refreshToken = foundUser.refreshToken.filter(
        (rt) => rt !== refreshToken
      );

      await axios.put(
        `http://127.0.0.1:5003/api/patients/${foundUser._id}`,
        {
          refreshToken: foundUser.refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      //clearCookie and send the response
      res.clearCookie("jwt", { httpOnly: true }); // add flag secure:true - only serves on https

      res.status(204);
    })
    .catch((err) => {
      if (err.response?.status) {
        // clear the cookies
        res.clearCookie("jwt", { httpOnly: true }); // add flag secure:true - only serves on https
        return res.sendStatus(204);
      }
      return res.sendStatus(500);
    });
};

module.exports = {
  handleLogout,
  handleLogin,
};
