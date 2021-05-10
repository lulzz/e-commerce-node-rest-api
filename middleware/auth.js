import expressJwt from 'express-jwt';

export const auth = () => {
  const secret = process.env.JWT_SECRET;

  return expressJwt({
    secret,
    algorithms: ['HS256'],
    isRevoked: handleIsAdmin,
  }).unless({
    path: [
      {
        url: /\/public\/uploads(.*)/,
        methods: ['GET', 'OPTIONS'],
      },
      {
        url: /\/api\/v1\/products(.*)/,
        methods: ['GET', 'OPTIONS'],
      },
      {
        url: /\/api\/v1\/categories(.*)/,
        methods: ['GET', 'OPTIONS'],
      },
      '/api/v1/users/login',
      '/api/v1/users/register',
    ],
  });
};

const handleIsAdmin = async (req, tokenPayload, done) => {
  if (!tokenPayload.isAdmin) {
    done(null, true);
  }

  done();
};
