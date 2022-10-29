## Steps to Run 

1. Clone project onto your machine by running the **git clone git_url .**
1. Create a database called `resort_app`
1. Seed the database by running the `seed.sql` file in the `seed folder`.
    1. To do this, navgiate to the `seed` folder in your terminal and run the following command : `psql -f seed.sql resort_app `
1. Create a `.env` file
1. Ensure your `.env` file have the below environment variables :
    1. `SECRET_KEY`  - You can assign it value
    1. `PORT` - You can assign it any value you want. Just remember your server will be listening on the PORT number you specify here!
    1. `DATABASE_HOST`-   The name of your dataabase host, which should be **localhost**
    1. `DATABASE_USERNAME` - Your database username
    1. `DATABASE_PORT` -  The port postgresql is running on. The default is **5432**
    1. `DATABASE_NAME`-  The name of the database you created
1. Run npm install 
1. Start Your Server by running  **npm run dev**
1. Import all of my endpoints into insomnia 
    1. Create a new **Request Collection** by clicking the create button and  then selecting **Request Collection**. Then give your collection a new name.
    1. To the top of Insomnia, you would see `Insomnia/The Name Of Your New Collection`, click the drop down arrow and then select `Import/Export`.
    1. Click `Import Data`, then `From File`, then search for the import file. The file is located in the `insomnia-imports` of the back-end folder and it is called **Insomnia.json**.
    1. Complete the import process.
1. Test your end points in Insomnia
