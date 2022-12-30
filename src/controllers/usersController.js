const path = require('path');
const { validationResult } = require('express-validator')
const db = require('../database/models');


const Users = db.user;

const controlador = {
	// ALL USERS

	// LOGIN USER
	login: (req, res) => {
        res.render('users/login')
    },

	// Form to register
    register: (req,res) => {
        let promUsers = Users.findAll();
        
        Promise
        .all([promUsers])
        .then(([allUsers]) => {
            return res.render(path.resolve(__dirname, '..', 'views',  'users/register.ejs'), {allUsers})})
        .catch(error => res.send(error));
	},

    // Create -  Method to store
    store: (req,res) => {

        Users.store(
            {
                name: req.body.name,
                last_name: req.body.last_name,
                user_name: req.body.user_name,
				email: req.body.email,
				password: req.body.password,
                create_date: new Date(),
			
            }
        )
        .then(()=> {
            return res.redirect('/users/login')})            
        .catch(error => res.send(error))
    },

	// DETAIL PROFILE
	profile: (req, res) => {
        db.user.findByPk('2')
            .then(user => {
                res.render('users/profile.ejs',{detallePerfil: user});
            });
    },

    // Update - Form to edit
	edit: (req, res) => {
		db.user.findByPk('2')
		.then(user => {
			res.render('users/editProfile.ejs',{perfilaEditar: user});
		});
    },

// Update - Method to update
    update: (req, res) => {
	
		let nombreImagen = req.file.filename;
	    let userId = db.user.findByPk('2');
	    

		Users.update(
            {
                name: req.body.name,
                last_name: req.body.last_name,
                user_name: req.body.user_name,
				birth_date: req.body.birth_date,
				email: req.body.email,
				image_user: nombreImagen,
				password: req.body.password,
                update_date: new Date(),
            },
			{
				where: {id:userId}
			}
        )
        .then(()=> {
            return res.redirect('/users/login')})            
        .catch(error => res.send(error))
    },

	// delete - Method to delete user
	erase: (req,res) => {
        let userId = req.params.id;

    db.user.erase(
		{where: {id: userId}, force: true}
		) // force: true es para asegurar que se ejecute la acción
        .then(()=>{
            return res.redirect('/')})
        .catch(error => res.send(error)) 
    }
    
}

module.exports = controlador;
