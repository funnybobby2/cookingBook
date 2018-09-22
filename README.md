<img src="https://github.com/happyksu/cookingBook/blob/master/logo/png/Cooking_logo_preview.png"/>

## Welcome to **Cooking book**

A modern website to save your favorite recipes and share them

### How to use

1. Install the mongoDB server
2. Update the mongo.bat script with the good version and the good path
3. Run mongo.bat
4. Execute mongo.exe (the mongoDB client)
5. Enter the command "use menus" to create the db named menus
6. Do npm Install
7. Do npm run build
8. Do npm run start
9. Open your navigator to localhost:8080

### How to save your DB
1. Open the mongoDB install folder of mongoexport.exe
2. Tape "cmd" into the folder input
3. Tape "mongoexport -d menus -c recipes -o E:\recipes.json"
4. Tape "mongoexport -d menus -c users -o E:\users.json"

### How to restore your DB
1. Open the mongoDB install folder of mongoexport.exe
2. Tape "cmd" into the folder input
3. Tape "mongoimport -d menus -c recipes E:\recipes.json"
4. Tape "mongoimport -d menus -c users E:\users.json"

### Support or Contact

Having trouble with Cooking book ? Contact me at funnybobby2@gmail.com and I’ll help you sort it out.
