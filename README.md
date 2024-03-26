# Nodejs Web Application Framework
This is a Node.js web application framework with expressive, elegant syntax. It makes building web applications simpler, and faster and requires less code.

## Table of Contents
- [Dependencies](#dependencies)
- [Key Features](#key-features)
- [Documentations](#documentations)
    - [Quick Start](#quick-start)
    - [Artisan Commands](#artisan-commands)
    - [Routes](#routes)
    - [Controller](#controllers)
    - [Model](#model)
    - [Database Migrations](#database-migrations)
- [Packages](#packages)
    - [CRUD Generator](#crud-generator)
    
### Dependencies
* NodeJs - v14 or higher
* NPM -v6 or higher
* NPM Packages :
    * axios
    * bcryptjs
    * body-parser
    * cookie-parser
    * cookie-session
    * cors
    * crypto-js
    * dotenv
    * ejs
    * express
    * express-flash
    * express-ipfilter
    * http
    * https
    * knex
    * moment-timezone
    * multer
    * mysql
### Key Features :
1. OOP Model
2. MVC Architecture
3. Build in query-builder(knex.js)
4. Database Migration System
5. Build in CRUD Generator
6. Easy Maintenance
7. Faster Developments
8. Secure
# Documentations
### Quick Start
1. `git clone`
2. `npm install`
3. create `.env` file from `.env.example`
4. create `app-config.json` from `app-config-exmaple.json` [API boilerplate only]
5. `npm install knex -g`
6. `knex migration:latest`
7. npm run node/nodemon (use `npm start` to run in production using pm2)

##### NB:
* 5 is required only for API boilerplate
* 4 and 5 is required when DB_USE = true in .env
### **Artisan Commands:**
|SL | Command | Use |
|:-: | :-----    | :-  |
|01|make controller [name]                                  | to generate a controller file|
|02|make c [name]                                           | to generate a controller file|
|03|make controller [name] -dir [sub dir path]             | to generate a controller file under a subdirectory|
|04|make model [name]                                       | to generate a model file|
|05|make m [name]                                           | to generate a model file|
|06|make model [name] -dir [sub dir path]                  | to generate a model file under a subdirectory|
|07|make model [name] --all                                 | to generate all related files (model,controller,migration)|
|08|make model [name] --all -fields "fieldname:datatype,fileldname"   | to generate all related files (model, controller,migration with those fields)|
|09|make library [name]                                     | to generate a library file|
|10|make lib [name]                                         | to generate a library file|
|11|make library [name] -dir [sub dir path]                | to generate a library file under a subdirectory|
|12|make middleware [name]                                  | to generate a middleware file|
|13|make middleware [name] -dir [sub dir path]             | to generate a middleware file under a subdirectory|
|14|make migration [table_name]  --create                  | to create a migration file|
|15|make migration [table_name] -fields "field1,field2" --create | to create a migration file using the fields name|
|16|make migration [table_name] -fields "field1:int,field2:string" --create | to create migration file using the fields name and datatype|
|17|help                                                    | to view artisan commands|
|18|-h                                                      | to view artisan command|

## Routes
folder path: root -> routes

you can make any new route file.

#### Sample code of route file
```javascript
require('../system/loader');
const express = require('express');
const route = express.Router();

exports.prefix = '/';
//write your routes here

exports.routes = route;
```
prefix will be added in every route automatically.

**NB:**

file name "`dev`" or "`development`" will be used only in development environments. those route will not be availabel in others environemt.
#### Web Routes (web.js)
write common routes here
#### API Routes (api.js)
write common routes here

#### Example routes
```javascript
route.get('/login', controller('user/login'));
```
Here "`user`" is a controller file name and "`login`" is a method of the controller.

## Controllers
Create controller file using artisan commands

```node artisan make controller [name]```  
or  
```node artisan make c [name]```  
or under a directory  
```node artisan make c [name] -dir [dir_path]``` 

This will create a file in root -> `/app/controllers/[name].js`

Write any method in your created controller like below
```javascript
index(Req, Res) {
    //write codes here
}
```
#### Render View File from controller method
```javascript
index(Req, Res) {
    Res.render("index",{Request:Req})
}
```
#### Passing data from controller method to view file
```javascript
index(Req, Res) {
    let title = 'This is sample data passing form controller';
    Res.render("index",{title,Request:Req})
}
```
You can retrieve the value in index.ejs file in title variable.

#### Retrieve request data in the controller
```javascript
index(Req, Res) {
    let body = Req.body;
    Res.render("index",{title,Request:Req})
}
```

### Request Data Validations
You have to load the validator by calling `loadValidator` method in the controller to use it. then you can validate all like below:
```javascript
submit(Req, Res) {
    //load validator
    let RequestData = loadValidator(Req, Res);

    //Retrieve data
    let email = RequestData.body('email', true,'Email').type('email').val();

    //validate the data
    if(!RequestData.validate()) return false;

    //validation passed

    Res.render("index",{Request:Req})
}
```
This `RequestData.validate()` method return previous page with `errors` and `old` data.
if you want to return back automatically the pass `false` as a parameter in the `validate` method.

#### How to catch old data and validation erros in previous method
You will get all old data in `Req.flash('old')[0]` object and all errors in the `Req.flash('errors')[0]' object, if submitted failure  to validate in submit method. You have to pass those data to views.
```javascript
create(Req, Res) {
    let data = {
        Request: Req,
        errors: Req.flash('errors')[0],
        old: Req.flash('old')[0]
    }
    Res.render('pages/samaple/create', data);
}
```
you will get all old data in `old` object, and all errors in the `errors' object in the view file.

#### Response Json data instead of rendering view file
```javascript
get(Req, Res) {
    let lists = {
        id:1,
        title:'sample data1'
    }
    Res.send(lists)
    // or
    // Res.json(lists)
}
```

## Model
Create controller file using artisan commands

```node artisan make model [name]```  
or  
```node artisan make m [name]```  
or under a directory  
```node artisan make model [name] -dir [dir_path]``` 

Use `--all` to create a controller and migration file at a time.  
#### **Note :**
* Use `--all` after -dir name if sub directory used
* Use `-fields "field1:datatype,field1"` to migration filed list. [not required]  
* Data type is not required for string type in the field list.
* Auto increment field `id` and timestamp fields(created_at, updated_at) is added by default. No need to add those in the field list
#### **Example :**
```node artisan make model [modelname] --all -fields "field1:int,field2"```


This will create a file in root -> `/app/model/[name]Model.js`;


## Database Migrations
We use [knex.js](http://knexjs.org) for building queries and migrations.
Please use their [docs](http://knexjs.org/guide/migrations.html#transactions-in-migrations) and commands.

#### **Follow the below standard for naming DB migration file :** 
1. Creating new table: `create_table_tablename` (--create)
2. Editing existing table : `alter_table_tablename` (--alter)
3. Adding new column in the existing table: `add_column_table_tablename` (--add)
4. Remove existing column in the table: `remove_column_table_tablename` (--remove)
5. Drop existing table: `drop_table_tablename` (--drop)

#### Create a new migration file
```
knex migrate:make create_table_table_name
```  
**Using artisan commands :** 
```
node artisan make migration [table_name]  --create
```
or  with fields:
```
node artisan make migration [table_name]  -fields "field1,field2"  --create
```
or  with fields and data type:
```
node artisan make migration [table_name]  -fields "field1:integer,field2:string"  --create
```  
This will create a file like `/migrations/20220524657843_create_table_table_name.js`. Your timestamp will be different. Open that file.

#### **Note :**
* Use `-fields "field1:datatype,field1"` to migration filed list. [not required]  
* Data type is not required for string type in the field list.
* Auto increment field `id` and timestamp fields(created_at, updated_at) is added by default. No need to add those in the field list

#### **Sample code of migrations file :**
```javascript

exports.up = function(knex) {
    return knex.schema.createTable('table_names', function (table) {
       table.increments('id');
       table.string('value1', 255).unique();
       table.string('value2', 255).notNullable();
       table.timestamps(true,true);
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable("table_names")
};

```

#### Run the migration :
```
knex migrate:latest
```

#### Run the migration in production :
```
$ knex migrate:latest --env production

# or

$ NODE_ENV=production knex migrate:latest
```

#### To rollback the last batch of migrations :
```
knex migrate:rollback
```
#### To rollback all the completed migrations :
```
knex migrate:rollback --all
```
#### To run the next migration that has not yet been run :
```
knex migrate:up
```
#### To run the specified migration that has not yet been run :
```
knex migrate:up 001_migration_name.js
```
#### To undo the last migration that was run :
```
knex migrate:down
```
#### To undo the specified migration that was run :
```
knex migrate:down 001_migration_name.js
```
#### To list both completed and pending migrations :
```
knex migrate:list
```


# Packages

## CRUD Generator
This Generator package provides you to generate full CRUD in a single command for the faster development of your applications.

### Commands :
`node artisan run crud-gen` [name] `-fields` [fields] `-dir` [directory name or path] `-layout` [layout dir name or path]
#### **Note :**
- *`-dir` and `-layout` is not required if there is no subdirectory*
- *`-layout` is not available for API Boilerplate*
- Use `--api` to generate API CRUD in main boilerplate. No need to add it the API boilerplate

#### **Example :**
Generate CRUD for category:
```
node artisan run crud-gen category -fields "title,description"
```
If you want to under a subdirectory like "admin"
```
node artisan run crud-gen category -fields "title,description" -dir admin
```

If you want use a different layout instead of the root layout folder of views then provide the layout folder path under views
```
node artisan run crud-gen category -fields "title,description" -layout layout/layout1
```
You can add data type in field list by adding a colon(:)