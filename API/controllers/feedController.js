const { validationResult } = require('express-validator');

exports.getPosts = (req, res, nxt) => {
  console.log('==> feedController: getPosts');
  res.status(200).json({
    posts: [
      {
        _id: '123',
        title: 'dummy post #1',
        content: 'this is a dummy post data',
        imageUrl: 'images/TS11B39KPLP_Zoom_F_1.jpg',
        creator: {
          name: 'dummy user'
        },
        createdAt: new Date()
      }
    ]
  });
};

exports.createPost = (req, res, nxt) => {
  console.log('==> feedController: createPost');

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ message: 'Validation failed, entered data is incorrect.', errors: errors.array() });
  }

  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: 'Post created successfully!',
    post: {
      _id: new Date().toString(),
      title: title,
      content: content,
      creator: {
        name: 'dummy user'
      },
      createdAt: new Date()
    }
  });
};
