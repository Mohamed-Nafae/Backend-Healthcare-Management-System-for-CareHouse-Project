module.exports = function verifyRequiredAttributes(model) {
  return (req, res, next) => {
    const requiredAttributes = model.schema.requiredPaths();
    const missingAttributes = [];

    for (const attribute of requiredAttributes) {
      // Check if the attribute is nested
      if (attribute.includes(".")) {
        const nestedAttributes = attribute.split(".");
        let nestedObject = req.body;
        for (const nestedAttribute of nestedAttributes) {
          if (!nestedObject.hasOwnProperty(nestedAttribute)) {
            missingAttributes.push(attribute);
            break;
          }
          nestedObject = nestedObject[nestedAttribute];
        }
      }
      // Check if the attribute is an array element
      else if (attribute.endsWith(".$")) {
        const arrayAttribute = attribute.slice(0, -2);
        if (
          !req.body[arrayAttribute] ||
          req.body[arrayAttribute].length === 0
        ) {
          missingAttributes.push(attribute);
        }
      }
      // Check if the attribute is a direct property of the request body
      else if (!req.body.hasOwnProperty(attribute)) {
        missingAttributes.push(attribute);
      }
    }

    if (missingAttributes.length > 0) {
      const errorMessage = `Missing required attributes: ${missingAttributes.join(
        ", "
      )}`;
      return res.status(400).json({ message: errorMessage });
    }

    next();
  };
};
