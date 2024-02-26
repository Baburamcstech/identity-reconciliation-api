const express = require("express");
const connection = require("../database");
const router = express.Router();

router.post("/", (req, res) => {
  const mobile = req.body.phoneNumber;
  const email = req.body.email;

  const query = `SELECT id, email, phoneNumber, linkedId, linkPrecedence, createdAt FROM Contact WHERE email='${email}' OR phoneNumber=${mobile} ORDER BY createdAt DESC`;
  connection.query(query, (err, results) => {
    if (err) {
      console.log(`Error during fetching data ${err}`);
      return res.status(500).json({ status: "error", message: "Internal Server Error" });
    }
    if (results.length > 0) {
      var oldestId = results[0].id;
      results.forEach(element => {
        if (element.id === oldestId || element.linkedId === "Secondary")
        {
             if(element.linkedId!=null)oldestId = element.linkedId;
             
             return;
        }
        element.linkedId = oldestId;
        element.linkPrecedence = "Secondary";
        const updateQuery = `UPDATE Contact SET linkPrecedence=?, linkedId=? WHERE id=?`;
        connection.query(updateQuery, ["Secondary", oldestId, element.id], (err, response) => {
          if (err) {
            console.log(`Error2 during updating data ${err}`);
            return res.status(500).json({ status: "error", message: "Internal Server Error" });
          }
          console.log(`Updated record with id ${element.id}`);
          var resl={
            "contact":{
                "primaryContatctId":oldestId,
                "emails": EmailArr,
                "phoneNumbers": phoneNumbersArr,
                "secondaryContactIds": secondaryContactIds
          }
        };
        return res.status(200).json({ status: "Success", result:resl });
        });
      });
      
      // Inserting new one
      const newUserQuery = 'INSERT INTO Contact (email, phoneNumber, linkedId, linkPrecedence) VALUES (?, ?, ?, ?)';
      const newUserValues = [email, mobile, oldestId,  "Secondary"];
      connection.query(newUserQuery, newUserValues, (err, response) => {
        if (err) {
          console.log(`Error during inserting new record ${err}`);
          return res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
        console.log(`Inserted new record for email ${email} and phoneNumber ${mobile}`);
        return res.status(200).json({ status: "Success",});
      });
    } else {
      console.log("No matching records found");
      const newUserQuery = "INSERT INTO Contact (email, phoneNumber) VALUES (?, ?)";
      const newUserValues = [email, mobile];
      connection.query(newUserQuery, newUserValues, (err, results) => {
        if (err) {
          console.log(`Error during inserting new record ${err}`);
          return res.status(500).json({ status: "error", message: "Internal Server Error" });
        }
        console.log(`Inserted new record for email ${email} and phoneNumber ${mobile}`);
        return res.status(200).json({ status: "Success purchage" });
      });
    }
  });
});

module.exports = router;
