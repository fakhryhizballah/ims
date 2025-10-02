// controllers/authController.js
const { User, Akses, Tenan, sequelize } = require("../models");
const { sendWa } = require("../helpers");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const SECRET_KEY = process.env.JWT_SECRET_KEY || "supersecret";
const authController = {
    // Show login page
    login: (req, res) => {
        if (req.cookies.jwt) {
            return res.redirect('/dashboard');
        }
        const r = req.csrfToken;
        res.render('auth/login', {
            csrfToken: r,
            title: 'Login',
            error: null
        });
    },

    // Process login
    processLogin: async (req, res) => {
        const { username, password } = req.body;
        console.log(req.body);
        let find = await User.findOne({
            where: {
                nowa: username,
                password: password
            },
            attributes: ['username', 'fullname', 'email', 'nowa', 'status']
        })

        if (find) {
            let payload = {
                username: find.username,
                fullname: find.fullname,
                email: find.email,
                nowa: find.nowa
            }

            const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "7d" });
            res.cookie('jwt', token, { httpOnly: true, sameSite: 'strict', secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 });

            return res.redirect('/dashboard');
        }

        // Check if the username and password are correct
        res.render('auth/login', {
            title: 'Login',
            csrfToken: req.csrfToken,
            error: 'No Whatsapp atau password salah'
        });
    },
    forgotLogin: (req, res) => {
        res.render('auth/forgot', {
            title: 'lupa password',
            csrfToken: req.csrfToken,
            error: null
        });
    },
    processForgot: async (req, res) => {
        try {
            const { nowa, otp, password } = req.body;
            console.log(req.body);
            let find = await User.findOne({
                where: {
                    nowa: nowa
                },
                atirbutes: ['username', 'nowa', 'status']
            })
            console.log(find);
            if (find) {
                let findOtp = await req.cache.get('otp:' + nowa);
                if (findOtp != req.body.otp) {
                    return res.render('auth/forgot', {
                        title: 'Login',
                        csrfToken: req.csrfToken,
                        error: 'OTP salah'
                    });
                }
                // return res.redirect('/login');
                await User.update({
                    password: password
                }, {
                    where: {
                        nowa: nowa
                    }
                })
                return res.render('auth/forgot', {
                    title: 'Login',
                    csrfToken: req.csrfToken,
                    error: 'Sukses'
                });
            }
            return res.render('auth/forgot', {
                title: 'Login',
                csrfToken: req.csrfToken,
                error: 'No Whatsapp Tidak Terdaftar'
            });


        } catch (error) {
            console.log(error);
            return res.render('auth/forgot', {
                title: 'Login',
                csrfToken: req.csrfToken,
                error: error
            });
        }
    },

    // Process logout
    processLogout: (req, res) => {
        res.clearCookie('jwt');
        res.redirect('/login');
    },
    sendOTP: async (req, res) => {
        let { nowa } = req.body;
        nowa = nowa.replace(/[^0-9]/g, '');
        let find = await User.findOne({
            where: {
                nowa: nowa
            }
        })
        if (find) {
            let random = Math.floor(Math.random() * 10000);
            await req.cache.set('otp:' + nowa, random, {
                EX: 60 * 5
            })
            await sendWa({
                "message": "OTP anda adalah *" + random + "* , jangan share ke orang lain.\n Hanya berlaku selama 5 menit.",
                "telp": nowa
            });

            // let send = await sendWa(otp);
            return res.status(200).json({
                success: true,
                error: false,
                message: nowa
            });
        }
        return res.status(401).json({
            success: false,
            error: false,
            message: nowa,
        });
    }
};

module.exports = authController;