const express = require('express');
const router = express.Router();
const productController = require('./controller/products.js');

router.post('/', productController.createProduct)
// 에러 이유? router.get 으로 지정되어 있었다
// 해결 방법: 에러난 시점 아래는 볼 필요 없고, 위에 내용을 콘솔로 찍히나 확인한다
/** 에러 내용: TODO: 이 전에 해결 못했던 mongoose.connect 에러 문제가 발생했다. 이 문제는 서버쪽 문제가 아닌, router 경로 설정을 잘못한 문제로 다시 접근해 보도록 한다
  ●  Cannot log after tests are done. Did you forget to wait for something async in your test?   
    Attempted to log "MongoDB Connected...".

      13 | app.use(express.json());
      14 |
    > 15 | mongoose.connect(`mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASSWORD}@cluster0.gnquy.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
         |
                                                                                             ^   
      16 |   .then(() => console.log(`MongoDB Connected...`))
      17 |   .catch(err => console.log(err));
      18 |

      at console.log (node_modules/@jest/console/build/CustomConsole.js:187:10)
      at index.js:15:180

Jest did not exit one second after the test run has completed.

This usually means that there are asynchronous operations that weren't stopped in your tests. Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.  
 */

module.exports = router;