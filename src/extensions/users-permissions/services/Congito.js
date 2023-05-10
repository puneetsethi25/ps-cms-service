const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

const COGNITO_REGION = env('COGNITO_REGION');
const COGNITO_USER_POOL_ID = env('COGNITO_USER_POOL_ID');

AWS.config.update({ region: COGNITO_REGION });

// Fetch the JSON Web Key Set (JWKS) from Cognito
async function fetchJWKS() {
  const cognitoIssuer = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${COGNITO_USER_POOL_ID}`;
  const cognitoJwksUrl = `${cognitoIssuer}/.well-known/jwks.json`;

  const { data } = await axios.get(cognitoJwksUrl);
  return data.keys;
}

// Validate the Cognito token and return the decoded payload
async function validateCognitoToken(token) {
  const jwks = await fetchJWKS();
  const header = jwt.decode(token, { complete: true }).header;
  const jwk = jwks.find(key => key.kid === header.kid);
  const pem = jwkToPem(jwk);

  return new Promise((resolve, reject) => {
    jwt.verify(token, pem, { algorithms: ['RS256'] }, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}

module.exports = {
  async authenticate(token) {
    try {
      const decoded = await validateCognitoToken(token);
      // Fetch the user based on the decoded token (e.g., decoded.username or decoded.email)
      const user = await strapi.query('user', 'users-permissions').findOne({ username: decoded.username });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (err) {
      throw new Error(`Authentication failed: ${err.message}`);
    }
  },
};
