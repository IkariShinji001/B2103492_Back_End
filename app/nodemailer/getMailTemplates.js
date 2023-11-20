const emailTemplates = {
  vefifyTemplateMail(username, verificationLink) {
    const html = `
          <!DOCTYPE html>
          <html ⚡4email>
              <head>
                  <meta charset="utf-8">
                  <style amp4email-boilerplate>body{visibility:hidden}
                  *{
                      font-family: sans-serif;
                  }
                  .wrapper-email{
                      margin: 0 20%;
                  }
                  .wrapper-header{
                      margin: 0 auto;
                  }
                  #confirm-img{
                      width: 40%;
                      margin: 0 30%;
                  }
                  h1{
                      text-align: center;
                  }
                  h2{
                      font-size: 20px;
                  }
                  .body-email{
                      margin: 0 20%;
                  }
                  p{
                      text-align: left;
                      line-height: 2;
                  }
                  .icon{
                      font-size: 30px;   
                      transform: rotate(90deg)
                  }
                  .star{
                      color: rgb(206, 206, 87);
                  }
                  .btn-wrapper{
                      display: flex;
                      justify-content: center;
                      margin-top: 20px;
                  }
                  .btn{
                      padding: 20px 40px;
                      cursor: pointer;
                      background-color: rgba(8, 8, 162, 0.953);
                      color: white;
                      border: none;
                      outline: none;
                      font-size: 20px;
                      border-radius: 5px;
                  }
                  .btn:hover{
                      background-color: rgb(44, 44, 234);
                  }
                  .email-signature {
                                font-family: Arial, sans-serif;
                                font-size: 14px;
                                color: #333333;
                                margin-top: 20px;
                              }
          
                              .signature-name {
                                font-weight: bold;
                              }
          
                              .signature-title {
                                color: #999999;
                              }
              </style>
              </head>
              <body>
              <div class="wrapper-email">
                  <div class="wrapper-header">
                      <img id="confirm-img" src="https://img.freepik.com/premium-vector/opened-envelope-document-with-green-check-mark-line-icon-official-confirmation-message-mail-sent-successfully-email-delivery-verification-email-flat-design-vector_662353-720.jpg?w=2000" />
                  </div>
                  <div class="body-email">
                     <h1> <span class="star">&#9885;</span> Verify your email <span class="star">&#9885;</span></h1>
                     <h2>Xin chào ${username},</h2>
                     <div class="wrapper-content">
                          <p class="content"> Chúng tôi cần xác thực email của bạn,
                          click vào nút bên dưới để hoàn thành việc đăng ký tài khoản: 
                          </p>          
                     </div>
                     <div class="btn-wrapper">
                      <a href=${verificationLink}>
                          <button class="btn">
                              Verify your email
                          </button>
                      </a>  
                     </div>
                     <div class="email-signature">
                      <p class="signature-name">Thanh Duy</p>
                      <p class="signature-title">Quản lí cấp cao - Thanh Duy Luxury</p>
                      </div>
                  </div>
              </div>
          </body>
      </html>   
       `;
    return html;
  },
  forgotPasswordTemplate(username, verificationLink) {
    const html = `
          <!DOCTYPE html>
          <html ⚡4email>
              <head>
                  <meta charset="utf-8">
                  <style amp4email-boilerplate>body{visibility:hidden}
                  *{
                      font-family: sans-serif;
                  }
                  .wrapper-email{
                      margin: 0 20%;
                  }
                  .wrapper-header{
                      margin: 0 auto;
                  }
                  #confirm-img{
                      width: 40%;
                      margin: 0 30%;
                  }
                  h1{
                      text-align: center;
                  }
                  h2{
                      font-size: 20px;
                  }
                  .body-email{
                      margin: 0 20%;
                  }
                  p{
                      text-align: left;
                      line-height: 2;
                  }
                  .icon{
                      font-size: 30px;   
                      transform: rotate(90deg)
                  }
                  .star{
                      color: rgb(206, 206, 87);
                  }
                  .btn-wrapper{
                      display: flex;
                      justify-content: center;
                      margin-top: 20px;
                  }
                  .btn{
                      padding: 20px 40px;
                      cursor: pointer;
                      background-color: rgba(8, 8, 162, 0.953);
                      color: white;
                      border: none;
                      outline: none;
                      font-size: 20px;
                      border-radius: 5px;
                  }
                  .btn:hover{
                      background-color: rgb(44, 44, 234);
                  }
                  .email-signature {
                                font-family: Arial, sans-serif;
                                font-size: 14px;
                                color: #333333;
                                margin-top: 20px;
                              }
          
                              .signature-name {
                                font-weight: bold;
                              }
          
                              .signature-title {
                                color: #999999;
                              }
              </style>
              </head>
              <body>
              <div class="wrapper-email">
                  <div class="wrapper-header">
                      <img id="confirm-img" src="https://img.freepik.com/premium-vector/opened-envelope-document-with-green-check-mark-line-icon-official-confirmation-message-mail-sent-successfully-email-delivery-verification-email-flat-design-vector_662353-720.jpg?w=2000" />
                  </div>
                  <div class="body-email">
                     <h1> <span class="star">&#9885;</span>Quên mật khẩu!<span class="star">&#9885;</span></h1>
                     <h2>Xin chào ${username},</h2>
                     <div class="wrapper-content">
                          <p class="content">Bạn đã quên mật khẩu của mình, nhấn vào nút bên dưới để
                          tiến hành đổi lại mật khẩu 
                          </p>          
                     </div>
                     <div class="btn-wrapper">
                      <a href=${verificationLink}>
                          <button class="btn">
                              Verify your email
                          </button>
                      </a>  
                     </div>
                     <div class="email-signature">
                      <p class="signature-name">Thanh Duy</p>
                      <p class="signature-title">Quản lí cấp cao - Thanh Duy Luxury</p>
                      </div>
                  </div>
              </div>
          </body>
      </html>   
       `;
    return html;
  },

  staffRegister(payload) {
    const html = `
    <!DOCTYPE html>
    <html ⚡4email>
        <head>
            <meta charset="utf-8">
            <style amp4email-boilerplate>body{visibility:hidden}
            *{
                font-family: sans-serif;
            }
            .wrapper-email{
                margin: 0 20%;
            }
            .wrapper-header{
                margin: 0 auto;
            }
            #confirm-img{
                width: 40%;
                margin: 0 30%;
            }
            h1{
                text-align: center;
            }
            h2{
                font-size: 20px;
            }
            .body-email{
                margin: 0 20%;
            }
            p{
                text-align: left;
                line-height: 2;
            }
            .icon{
                font-size: 30px;   
                transform: rotate(90deg)
            }
            .star{
                color: rgb(206, 206, 87);
            }
            .btn-wrapper{
                display: flex;
                justify-content: center;
                margin-top: 20px;
            }
            .btn{
                padding: 20px 40px;
                cursor: pointer;
                background-color: rgba(8, 8, 162, 0.953);
                color: white;
                border: none;
                outline: none;
                font-size: 20px;
                border-radius: 5px;
            }
            .btn:hover{
                background-color: rgb(44, 44, 234);
            }

            .staffID{
              font-size: 18px;
              font-weight: bold;
            }

            .password{
              font-size: 18px;
              font-weight: bold;
            }
            .email-signature {
                          font-family: Arial, sans-serif;
                          font-size: 14px;
                          color: #333333;
                          margin-top: 20px;
                        }
    
                        .signature-name {
                          font-weight: bold;
                        }
    
                        .signature-title {
                          color: #999999;
                        }
        </style>
        </head>
        <body>
        <div class="wrapper-email">
            <div class="wrapper-header">
                <img id="confirm-img" src="https://img.freepik.com/premium-vector/opened-envelope-document-with-green-check-mark-line-icon-official-confirmation-message-mail-sent-successfully-email-delivery-verification-email-flat-design-vector_662353-720.jpg?w=2000" />
            </div>
            <div class="body-email">
               <h1> <span class="star">&#9885;</span>Xin chào nhân viên của Thế giới tiểu thuyết<span class="star">&#9885;</span></h1>
               <h2>Xin chào ,</h2>
               <div class="wrapper-content">
                    <p class="content">
                    Bạn đã được cấp tài khoản để truy cập vào trang quản trị của Thế giới tiểu thuyết
                    </br>
                    <div> 
                    <div class="staffID"> StaffID : ${payload.staffID} </div>
                    <div class="password"> Password: ${payload.password} </div>
                    </div>
                    </br> Xin giữ kỹ đừng để bị lộ ra ngoài, cảm ơn !
                    </p>          
               </div>
               <div class="email-signature">
                <p class="signature-name">Thanh Duy</p>
                <p class="signature-title">Quản lí cấp cao - Thanh Duy Luxury</p>
                </div>
            </div>
        </div>
    </body>
</html>   
 `;
    return html;
  },

  orderConfirmationTemplate(
    username,
    orderDetails,
    totalPrice,
    diliveryDate,
    createdAt
  ) {
    const html = `
      <!DOCTYPE html>
      <html ⚡4email>
        <head>
          <meta charset="utf-8">
          <style amp4email-boilerplate>body{visibility:hidden}
          *{
              font-family: sans-serif;
          }
          .wrapper-header{
              margin: 0 auto;
          }
          #confirm-img{
              width: 30%;
              margin: 0 30%;
          }
          h1{
              text-align: center;
          }
          h2{
              font-size: 20px;
          }
          .body-email{
              margin: 0 20%;
          }
          p{
              text-align: left;
              line-height: 2;
          }
          .icon{
              font-size: 30px;   
              transform: rotate(90deg)
          }
          .star{
              color: rgb(206, 206, 87);
          }
          .btn-wrapper{
              display: flex;
              justify-content: center;
              margin-top: 20px;
          }
          .btn{
              padding: 20px 40px;
              cursor: pointer;
              background-color: rgba(8, 8, 162, 0.953);
              color: white;
              border: none;
              outline: none;
              font-size: 20px;
              border-radius: 5px;
          }
          .btn:hover{
              background-color: rgb(44, 44, 234);
          }

          .totalPrice{
            font-size: 25px;
            color: #c92127;
            font-weight: bold;
          }

          .totalPrice-label{
            font-size: 18px;
          }

          .book{
            font-size: 18px;
          }

          p{
            color: black;
          }

          .date{
            font-size: 15px !important;
            margin: 4px 0 !important;
          }

          .email-signature {
                        font-family: Arial, sans-serif;
                        font-size: 14px;
                        color: #333333;
                        margin-top: 20px;
                      }

                      .signature-name {
                        font-weight: bold;
                      }

                      .signature-title {
                        color: #999999;
                      }
        </style>
      </head>
      <body>
        <div class="wrapper-email">
          <div class="wrapper-header">
            <img id="confirm-img" src="https://img.freepik.com/premium-vector/opened-envelope-document-with-green-check-mark-line-icon-official-confirmation-message-mail-sent-successfully-email-delivery-verification-email-flat-design-vector_662353-720.jpg?w=2000" />
          </div>
          <div class="body-email">
            <h1> <span class="star">&#9885;</span> Đặt hàng thành công <span class="star">&#9885;</span></h1>
            <h2>Xin chào ${username},</h2>
            <div class="wrapper-content">
              <p class="content"> 
                Cảm ơn bạn đã đặt hàng tại Thế giới tiểu thuyết. Đơn hàng của bạn đã được xác nhận và đang được xử lý. Chi tiết đơn hàng:
                <ul>
                  ${orderDetails
                    .map(
                      (item) =>
                        `<li class="book">${item.book.name} - Volume ${
                          item.book.volume
                        }
                         - Số lượng: ${
                           item.quantity
                         } - Giá: ${new Intl.NumberFormat().format(
                          item.book.discountPrice
                        )} VND/cuốn</li>`
                    )
                    .join('')}
                </ul>
                <p class="date">Ngày đặt hàng:<em> ${createdAt} </em></p>
                <p class="date">Ngày dự kiến giao hàng:<em> ${diliveryDate} </em></p>
                <span class="totalPrice-label">Tổng giá trị đơn hàng: <span class="totalPrice"> ${new Intl.NumberFormat().format(
                  totalPrice
                )} </span> VND. </span>
              </p>          
            </div>
            <div class="email-signature">
              <p class="signature-name">Thanh Duy</p>
              <p class="signature-title">Quản lý cấp cao - Thế giới tiểu thuyết</p>
            </div>
          </div>
        </div>
      </body>
      </html>   
    `;
    return html;
  },
};

module.exports = emailTemplates;
