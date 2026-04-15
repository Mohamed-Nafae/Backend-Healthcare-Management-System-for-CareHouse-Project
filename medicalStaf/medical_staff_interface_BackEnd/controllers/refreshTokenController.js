const jwt = require("jsonwebtoken");
const axios = require("axios");

const handleRefreshToken = (medicalStaffName) => {
  return async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) {
      return res.sendStatus(401);
    }
    const refreshToken = cookies.jwt;

    res.clearCookie("jwt", { httpOnly: true });

    try {
      const response = await axios.get(
        `http://127.0.0.1:5007/api/${medicalStaffName}/query/?refreshToken=${refreshToken}`
      );
      const foundUser = response.data;
      const newRefreshTokenArray = foundUser.refreshToken.filter(
        (rt) => rt !== refreshToken
      );
      console.log(refreshToken);

      // evaluate jwt
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
          if (err || foundUser._id !== decoded._id) {
            console.log("expired refresh token");
            try {
              await axios.put(
                `http://127.0.0.1:5007/api/${medicalStaffName}/${foundUser._id}`,
                {
                  refreshToken: newRefreshTokenArray,
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              return res.sendStatus(403);
            } catch (err) {
              if (!err.response?.status) return res.sendStatus(500);
              return res.status(err.response.status).json(err.response.data);
            }
          }
          // refresh token was still valid
          const role =
            medicalStaffName === "doctors"
              ? foundUser.role_doctor
              : medicalStaffName === "nurses"
              ? foundUser.role_nurse
              : role_driver;
          const accessToken = jwt.sign(
            {
              _id: foundUser._id,
              email_address: foundUser.email_address,
              role: role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m" } // 10m
          );

          const newRefershToken = jwt.sign(
            { _id: foundUser._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "1d" } // 1d
          );
          // saving refresh token with current user
          foundUser.refreshToken = [...newRefreshTokenArray, newRefershToken];
          try {
            await axios.put(
              `http://127.0.0.1:5007/api/${medicalStaffName}/${foundUser._id}`,
              {
                refreshToken: foundUser.refreshToken,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            res.cookie("jwt", newRefershToken, {
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000, // add secure opption for https
            });
            res
              .status(200)
              .json({ accessToken: accessToken, id: foundUser._id });
          } catch (err) {
            if (!err.response?.status) return res.sendStatus(500);
            return res.status(err.response.status).json(err.response.data);
          }
        }
      );
    } catch (err) {
      if (err.response?.status) {
        //Detected refresh token reuse!
        jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN_SECRET,
          async (err, decoded) => {
            if (err) return res.sendStatus(403); // Forbidden
            console.log("attempted refersh token reuse!");
            try {
              await axios.put(
                `http://127.0.0.1:5007/api/${medicalStaffName}/${decoded._id}`,
                {
                  refreshToken: [],
                },
                {
                  headers: {
                    "Content-Type": "application/json",
                  },
                }
              );
              return res.sendStatus(403); // Forbidden
            } catch (err) {
              if (!err.response?.status) return res.sendStatus(500);
              return res.status(err.response.status).json(err.response.data);
            }
          }
        );
      } else return res.sendStatus(500);
    }
  };
};

module.exports = {
  handleRefreshToken,
};
