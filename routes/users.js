var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers')
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn)
  {
    next()
  }else{
    res.redirect('/login')
  }
}


/* GET home page. */
router.get('/', function (req, res, next) {
  let user = req.session.user
  console.log(user)
  productHelpers.getAllProducts().then((products) => {

    res.render('users/view-products', { products, user })
  })


});
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/')
  }
  else if(req.session.userErr){

    res.render('users/login', { userErr: req.session.userErr })
    req.session.userErr = false
  }else{

    res.render('users/login', { loginErr: req.session.loginErr })
    req.session.loginErr = false
  }
})

router.get('/signup', (req, res) => {
  res.render('users/signup')
})

router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response)
  })
})

router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    
    if (response.user){
      if (response.status) {
        req.session.loggedIn = true
        req.session.user = response.user
        res.redirect('/')
      } else {
  
        req.session.loginErr = true
        console.log('password err')
        res.redirect('/login')
      }
    }else if(response.mail){
      req.session.userErr=true
      console.log('email section')
      res.redirect('/login')
    }

  })



})
router.get('/logout', (req, res) => {
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifyLogin,(req,res)=>{
  res.render('users/cart')
})



module.exports = router;

