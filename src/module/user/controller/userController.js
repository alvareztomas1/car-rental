const AbstractController = require("./error/abstractControllerError");
const { fromDataToUserEntity } = require("../mapper/userMapper");

module.exports = class UserController extends AbstractController{
	constructor(userService){
		super();
		this.ROUTE_BASE = "/user";
		this.userService = userService;
	}

	configureRoutes(app){
		const ROUTE = this.ROUTE_BASE;
		app.get(`${ROUTE}/list`, this.index.bind(this));  
		app.get(`${ROUTE}/create`, this.create.bind(this));
		app.post(`${ROUTE}/create`, this.save.bind(this));
		app.post(`${ROUTE}/delete/:id`, this.delete.bind(this));      
      
	}

	async index(req, res){
		try{
			const users = await this.userService.getAll();
			res.render("user/view/index.html", { users: users ? users : false, pageTitle: "Users list" });
		}catch(e){
			req.session.errors = [e.message, e.stack];
			res.redirect("/");
		}
	}

	create(req, res){
		res.render("user/view/form/form.html", { pageTitle: "Add new user" });
	}

	async save(req, res){
		const formData = fromDataToUserEntity(req.body);
		try{
			const savedUser = await this.userService.save(formData);

			// TODO: Add validation

			req.session.messages = [`User #${savedUser.id} added succesfully`];
			res.redirect("/");

		}catch(e){
			req.session.errors = [e.message, e.stack];
			res.redirect("/");
		}
	}

	async delete(req, res){
		try{
			const userId = req.params.id;
			const deletedUser = await this.userService.delete(userId);

			req.session.messages = [`User #${deletedUser.id} ${deletedUser.names} ${deletedUser.surnames} deleted succesfully`];

			res.redirect("/");

		}catch(e){
			req.session.errors = [e.message, e.stack];
			res.redirect("/");
		}
	}
};