let users_names = [];
let female_users = [];
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const config_db = {
	host:'mongodb://localhost:',
	port:27017,
	name:'for_task'
}
let database_url = config_db.host + config_db.port+ '/' + config_db.name;
mongoose.connect(database_url);

const db = mongoose.connection;

//here we check the status of the db
db.once('open',function(){
	console.log('connection says:  I am ok bro ;Lets to do great things )');
});


//here we define schema,model for our keeping data in database
const userScheme = new Schema({
	name:String,
	age:Number,
	gender:String,
	tasks:[String]
});

const taskScheme = new Schema({
	 title:String,
	 text:String,
	 completed:Boolean,
	 created:Date,
	 updated:Date
});

//insert user 
userScheme.statics.insertUser = function(user){
	let item = new User({
			name:user.name,
			age:user.age,
			gender:user.gender,
			tasks:user.tasks
		});
		item.save().then(() => {
			this.find().then(console.log('ok'))
		});
}

//update user 
userScheme.statics.updateUserNameByID = function(id,new_name){
	try{
		
		this.update({_id:id},{$set:{name:new_name}}).then((status)  => {console.log(status)});
			
	}catch(e){
		console.log(e);
	}
}
userScheme.statics.getAllUserNamesAndSortByNames = function(){
	try{
		this.distinct('name').then((data) => {console.log(data);data.sort();console.log(data);users_names = data;console.log(users_names);});
	}
	catch(e){
		console.log(e);
	}
}
userScheme.statics.getAllFemaleUsers = function(){
	this.find({gender:'female'}).then((data) => {console.log('female users:',data,'::');});

}

taskScheme.statics.addTask = function(task){
	let tk = new Task({
		title:task.title,
		text:task.text,
		completed:task.completed,
		created:task.created,
		updated:task.updated,
		tasks:task.tasks	
	});
	tk.save().then((data) => {console.log(data);});
	this.find().then(console.log);
	
}

taskScheme.statics.updateAllTasksToIncomplete = function(){
	this.updateMany({completed:true},{$set:{completed:false}}).then(this.find().then(console.log));
}
taskScheme.statics.deleteAllCompleted = function(){
	try{
		this.deleteMany({completed:true}).then(console.log('deleted'));	
	}catch(e){
		console.log(e);
	}
	
}

userScheme.statics.allInCompleteTaskSort = function(user_id){
	this.findOne({_id:user_id},function(err,user){
		console.log('user',user);
		console.log(user.tasks);
		let tasks_arr_ = [];
		for(i=0;i<user.tasks.length;i++){
				console.log(user.tasks[i]);
				let count = 0;
				Task.findOne({_id:user.tasks[i],completed:false},function(err,task){
					count++;
					tasks_arr_.push(task);
					if(count == tasks_arr_.length-1){
						console.log(tasks_arr_.sort());
					}
					
				});
		}
		
	});
}
const User = mongoose.model('User',userScheme);
const Task = mongoose.model('Task',taskScheme);
//exampe of inserting
//User.insertUser({name:"George",age:'28',gender:'male',tasks:['5b431ff6c0c2a80098d1c409','5b431c755b22b71b90abbedb','5b431f7147afde09d424a777']});
//User.insertUser({name:"Anna",age:'22',gender:'female'});

//example of updating
//User.updateUserNameByID('5b43083566aad218f0f8a0f8','Kerry');

//example of getting only users' names and sorting them 
//User.getAllUserNamesAndSortByNames();

//example of getting all female users
//User.getAllFemaleUsers();

//adds task
/*
Task.addTask({
	title:'specific',
	text:'text of the task',
	completed:false,
	created:'2018-07-09T08:29:27.790Z',
	updated:''
});
*/

//it updates all true values to false
//Task.updateAllTasksToIncomplete();

//this deletes all completed tasks
//Task.deleteAllCompleted();

//it sorts all incomplete tasks by date
//Task.allIncompleteTasksorted();


//here we need user id,,,and then our allInCompleteTaskSort function will find user by id,then user's tasks,after that by id of the task it will push task objects into array and then sort them
//User.allInCompleteTaskSort('5b434cc959b30b1ee0ac076a');