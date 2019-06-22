exports.getPosts = (req, res, nxt) => {
  console.log('==> feedController: getPosts');
  res.status(200).json({
    posts: [{ title: 'dummy post #1', content: 'this is a dummy post data' }]
  });
};

exports.createPost = (req, res, nxt) => {
  console.log('==> feedController: createPost');
  const title = req.body.title;
  const content = req.body.content;
  res.status(201).json({
    message: 'Post created successfully!',
    post: { id: new Date().toString(), title: title, content: content }
  });
};
