const express = require('express');
const router = express.Router();
const { Login, SignUp, EventRegister } = require('../model/schema');
const bcrypt = require("bcrypt");

let sess;
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);
    try {
        if (!email || !password) {
            res.status(400).json({ "error": "please fill credentails" });  //400 for bad request
        }
        const userExit = await SignUp.findOne({ email: email });
        console.log(userExit);
        if (userExit) {
            //const isMatch =   bcrypt.compare(password, userExit.password);
            const isMatch = bcrypt.compareSync(password, userExit.password);
            if (isMatch) {
                req.session.email = userExit.email;
                res.status(200).json({ "message": "Logged In Sucessfully" });
            }
            else {
                res.status(400).json({ "error": "Email or password is incorrect" });
            }
        }
        res.status(401).json({ "error": "Email is not registed" });

    }
    catch (err) {
        console.log(err);
    }
});

router.post("/signup", async (req, res) => {
    try {
        const { email, password, cpassword } = req.body;
        if (!email || !password || !cpassword) {
            res.status(401).json({ "error": "please fill credentails" });
        }
        const userExit = await SignUp.findOne({ email: email });

        console.log(userExit);
        if (!userExit) {
            if (password === cpassword) {
                const newUser = await SignUp({ email, password, cpassword });
                const addUser = await newUser.save();

                if (addUser)
                    res.status(201).json({ message: "add successfully" });
            }
            else {
                res.status(400).json({ message: "password & cpassword is not same" });

            }
        }
        else {
            res.status(422).json({ "message": "email is already exist" });
        }
    }
    catch (err) {
        console.log(err);
    }
})
router.post("/eventregister", async (req, res) => {
    try {
        if (req.session.email) {
            const { firstname, lastname, location, stime, dates, mobileno, agenda } = req.body;
            if (!firstname || !lastname || !location || !stime || !dates || !mobileno || !agenda) {
                res.status(422).json({ "error": "please fill credentails" });
            }
            const todayDate = Date.parse(new Date());
            const selectedDate = Date.parse(dates);

            if (selectedDate > todayDate) {
                console.log("hgcjh");
                const eventExist = await EventRegister.find({
                    $and:
                        [{ location: location },
                        { dates: dates }
                        ]
                })
                console.log(eventExist[0]);


                if (eventExist.length !== 0) {
                    const obj = eventExist[0].stime;
                    const prevTime = obj.slice(0, 2);
                    const currTime = stime.slice(0, 2);
                    if (currTime == prevTime) {
                        console.log(currTime);
                        res.status(302).json(currTime);
                    }
                    if (mobileno.length == 10) {
                        const event = await EventRegister({ firstname, lastname, location, stime, dates, mobileno, agenda });
                        const addEvent = await event.save();

                        if (addEvent) {
                            res.status(201).json({ "message": "Event is created successfully" });
                        }
                    }
                    else {
                        res.status(401).json({ "message": "no shoulb be 10 digits" });
                    }
                }

                else {
                    if (mobileno.length == 10) {
                        const event = await EventRegister({ firstname, lastname, location, stime, dates, mobileno, agenda });
                        const addEvent = await event.save();

                        if (addEvent) {
                            res.status(201).json({ "message": "Event is created successfully" });
                        }
                    }
                    else {
                        res.status(401).json({ "message": "no shoulb be 10 digits" });
                    }
                }

            }
            else {
                res.status(400).json({ "message": "Date should be greater than  current date" });
            }


        }
    }
    catch (err) {
        console.log(err);
    }

})
router.get('/eventlist', async (req, res) => {
    try {
        if (req.session.email) {
            const eventlist = await EventRegister.find();
            if (eventlist)
                res.send(eventlist);

        }
    }
    catch (err) {
        console.log(err);
    }
})
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }
        else
            res.status(401).json({ "message": "logout is done" });

    });
})
module.exports = router;
