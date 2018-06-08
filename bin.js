const program = require('commander')
const client = require('./client')
const flatten = require('flatten-array')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
program
  .version('0.1.0')
  .option('-t, --token [token]', 'GitHub token')
  .option('-l, --language', 'Language')
  .parse(process.argv);

if (program.token){
    client.authenticate({
        type: 'token',
        token: program.token
    });
}

// Since 2 days
const created = new Date();
created.setDate(created.getDate()-7);
const tdate = '2018-02-02'
const stars = '5'
const q = `language:javascript created:>${tdate} star:>=${stars}`



async function getRepos() {
    let userList = [];
    let items = [];
    let result = await client.search.repos({q});
  
    items = result.data.items;
  
    var newUserList = flatten(Promise.all(items.map(async function (t){
  
      userList = await client.activity.getStargazersForRepo({owner: t.owner.login, repo: t.name});
      userList = userList.data.map(function (item){
        return item.user;
      });

      
      return userList
    })).then(function(result){
     var theListOfUser = flatten(result);
     const csvWriter = createCsvWriter({
        path: 'file.csv',
        header: [
            {id: 'login', title: 'login'},
            {id: 'html_url', title: 'repo'},
        ]
  
      });
      
      csvWriter.writeRecords(theListOfUser);
    }));
  
  }
  
  getRepos();
