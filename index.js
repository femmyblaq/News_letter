const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const mailchimp = require("@mailchimp/mailchimp_marketing");
const app = express();
app.use(express.static("public"));
const port = 5000;

mailchimp.setConfig({
  apiKey: "e94053372137fcaf7cecdc89af0921e1-us10",
  server: "us10",
});

app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/register.html");
});
app.post("/", (req, res) => {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;
  console.log(firstName, lastName, email);
  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  let dataJson = JSON.stringify(data);

  var options = {
    url: "https://us10.api.mailchimp.com/3.0/lists/1ab03b2e4e",
    method: "POST",
    headers: {
      Authorization: "habeeb e94053372137fcaf7cecdc89af0921e1-us10",
    },
    body: dataJson,
  };

  request(options, async function (error, response, body) {
    if (error) {
      // res.send("<h4>There was problem signing up to the Newsletter.</h4>");
      // res.redirect("/failure.html");
      res.sendFile(`${__dirname}/failure.html`);
    } else {
      if (response.statusCode === 200) {
        res.sendFile(`${__dirname}/success.html`);
        // res.redirect("/success.html");
      } else {
        res.sendFile(`${__dirname}/failure.html`);
      }
    }
  });
});
app.post("/failure.html", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});

// app.get("/audience", async (req, res) => {
//   // const response = await mailchimp.ping.get();
//   const response = await mailchimp.lists.getListMembersInfo("1ab03b2e4e");
//   res.status(200).json(response);
// });

// // getInfo();
// const memberInfo = {
//   full_name: "Olufemi Habeeb",
//   email_address: "HY@gmail.com",
//   status: "subscribed",
// };
// app.post("/audience", async (req, res) => {
//   try {
//     const response = await mailchimp.lists.addListMember(
//       "1ab03b2e4e",
//       JSON.stringify(memberInfo)
//     );
//     console.log(response);
//   } catch (error) {
//     console.log(error);
//   }
// });

// run();

// mailchimp Api key-> e94053372137fcaf7cecdc89af0921e1-us10

// mailchimp List ID -> 1ab03b2e4e
