## myserver-upload

File uploading nodejs module for `myserver`.

``` js

const uploader = require('myserver-upload');
const server = myServer(router);

// middleware to upload files to path /store
router.use(uploader('/store'));

```