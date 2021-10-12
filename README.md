--------------------------------------------------------------------------------------
O acesso ao servidor é feito através de ssh sendo o username o número do grupo. A password inicial é também o número do grupo e deve ser alterada após o primeiro login\
    --ssh psi016@appserver.alunos.di.fc.ul.pt
    
Cada grupo tem um utilizador no servidor mongo. O nome do utilizador é igual ao número do grupo. A password também é igual ao número do grupo.\
    --mongo --username psi016 --password --authenticationDatabase psi016 appserver.alunos.di.fc.ul.pt/psi016
    
A forma de executar o servidor node que serve o front-end Angular deve ser a seguinte\
    --ng serve --port 3016 --host 0.0.0.0 --disableHostCheck true
    
A connection string para acesso à base de dados mongo deve ser a seguinte \
    --mongodb://psi016:psi016@localhost:27017/psi016?retryWrites=true&authSource=psi016
--------------------------------------------------------------------------------------
\
PORTS:
 - 3016
 - 3066 

--------------------------------------------------------------------------------------
\
Command line instructions \
\
You can also upload existing files from your computer using the instructions below. \
Git global setup \
\
git config --global user.name "NOME" \
git config --global user.email "fcNUMBER@alunos.fc.ul.pt" 

--------------------------------------------------------------------------------------
\
Create a new repository \
\
git clone https://git.alunos.di.fc.ul.pt/fc51033/psi.git \
cd css \
touch README.md \
git add README.md \
git commit -m "add README" \
git push -u origin master 

--------------------------------------------------------------------------------------
\
Push an existing folder \
\
cd existing_folder \
git init \
git remote add origin https://git.alunos.di.fc.ul.pt/fc51033/psi.git \
git add . \
git commit -m "Initial commit" \
git push -u origin master 

--------------------------------------------------------------------------------------
\
Push an existing Git repository \
\
cd existing_repo \
git remote rename origin old-origin \
git remote add origin https://git.alunos.di.fc.ul.pt/fc51033/psi.git \
git push -u origin --all \
git push -u origin --tags 

--------------------------------------------------------------------------------------
\
PS by Jorjão: KILL ME 

