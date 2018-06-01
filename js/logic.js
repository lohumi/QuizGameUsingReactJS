(function(){
'use strict';
/*
--Author:Neeraj Lohumi
--how to run-To see the code in action follow below steps:-
use below command in terminal to install http server globally
Step 1- npm install http-server -g
Step 2- http-server

then click on the url shown ,the default html page  will show up.
mongoose-tiny can also be  used as a web server.

*/
var Quiz=React.createClass({
    
    getInitialState:function(){
        return _.extend({
            bgClass: 'neutral',
            showContinue: false,
        }, this.props.data.selectGame());
    },
    //this event fires when user click on any of the options
    handleBookSelected:function(title){
        var isCorrect = this.state.checkAnswer(title);
        this.setState({
            bgClass:isCorrect?'pass':'fail',
            showContinue:isCorrect
        })
    },
    //when user selects the correct answer,enable the button and load new question.
    handleContinue:function(){
        this.setState(this.getInitialState()) ;
    },
    
    handleAddGame:function(){
        routie('add');
    },
    render:function(){
        return(<div >
         <div className="row">
            <div className="col-md-4">
            <img src={this.state.author.imageUrl} className="authorimage col-md-3"/>
            </div>
            <div className={"col-md-7"}>
            {this.state.books.map(function(b){
                return <Book  onBookSelected={this.handleBookSelected} key={b} title={b} />;
            }, this)}
            </div>
             <div className={"col-md-1 " + this.state.bgClass} />
            </div>

            {this.state.showContinue ?(
            <div className="row">
                <div className={"col-md-12"}>
                <input onClick={this.handleContinue} type="button" className="btn btn-primary btn-lg pull-right" value="Continue"/> 
                </div>
            </div>) : <span/>
            }
          <div className="row">
            <div className="col-md-12">
                <input onClick={this.handleAddGame} id="addGameButton" type="button" value="Add Game" className="btn " />
            </div>
          </div>
        </div>)
    }
});

var Book=React.createClass({
    propTypes: {
        title: React.PropTypes.string.isRequired
    },
    handleClick:function(){
        this.props.onBookSelected(this.props.title);
    },
    render:function(){
        return <div onClick={this.handleClick} className="answer">
       <h4> {this.props.title}</h4>
        </div>
    }
});
//getRefs method return value of each fields in the Add form
var AddGameForm=React.createClass({
    handleSubmit:function(e){
        this.props.onGameFormSubmitted(getRefs(this));
        e.preventDefault();
        //console.log('form submit event');
    },
    render:function(){
        return (
            <div>
                <div className="row">
                <div className="col-md-12">
                <h1>Add Game Form</h1>
                <form role="form" onSubmit={this.handleSubmit}>
                                  <div className="form-group">
                                    <input ref="imageUrl" type="text" className="form-control" placeholder="Image Url" />
                                  </div>
                                  <div className="form-group">
                                    <input ref="answer1" type="text" className="form-control" placeholder="Answer 1" />
                                  </div>
                                  <div className="form-group">
                                    <input ref="answer2" type="text" className="form-control" placeholder="Answer 2" />
                                  </div>
                                  <div className="form-group">
                                    <input ref="answer3" type="text" className="form-control" placeholder="Answer 3" />
                                  </div>
                                  <div className="form-group">
                                    <input ref="answer4" type="text" className="form-control" placeholder="Answer 4" />
                                  </div>
                                  <button type="submit" className="btn btn-default">Submit</button>
                  </form>
                </div>
                
                
                </div>
            </div>
        )
    }
});

var data = [
    {
        name: 'Mark Twain', 
        imageUrl: 'images/authors/marktwain.jpg',
        books: ['The Adventures of Huckleberry Finn']
    },
    {
        name: 'Joseph Conrad',
        imageUrl: 'images/authors/josephconrad.png',
        books: ['Heart of Darkness']
    },
    {
        name: 'J.K. Rowling',
        imageUrl: 'images/authors/jkrowling.jpg',
        imageSource: 'Wikimedia Commons',
        imageAttribution: 'Daniel Ogren',
        books: ['Harry Potter and the Sorcerers Stone']
    },
    {
        name: 'Stephen King',
        imageUrl: 'images/authors/stephenking.jpg',
        imageSource: 'Wikimedia Commons',
        imageAttribution: 'Pinguino',
        books: ['The Shining','IT']
    },
    {
        name: 'Charles Dickens',
        imageUrl: 'images/authors/charlesdickens.jpg',
        imageSource: 'Wikimedia Commons',
        books: ['David Copperfield', 'A Tale of Two Cities']
    },
    {
        name: 'William Shakespeare',
        imageUrl: 'images/authors/williamshakespeare.jpg',
        imageSource: 'Wikimedia Commons',
        books: ['Hamlet', 'Macbeth', 'Romeo and Juliet']
    }
];
//load random answers
var selectGame=function(){
    //select 4 random books out of the collection
    var books = _.shuffle(this.reduce(function (p, c, i) {
        return p.concat(c.books);
    }, [])).slice(0,4);
    var answer = books[_.random(books.length-1)];
    //make sure the answer is present in the given options
    return {
        books: books, //set of 4 books
        author: _.find(this, function (author) {
            return author.books.some(function (title) {
                return title === answer;
            });
        }),
        checkAnswer:function(title){
            return this.author.books.some(function(t){
                    return t===title;
            })
        }
    };

};
data.selectGame = selectGame;
//adding hash routing in the URL
routie({
    'add':function(){
        React.render(
        <AddGameForm onGameFormSubmitted={handleAddFormSubmitted}/>,document.getElementById('app') 
     );
    },
    '':function(){
    React.render(
    <Quiz data={data} />,  document.getElementById('app'));
}
});
//add newly added data to collections
function handleAddFormSubmitted(data){
var quizData=[{
    imageUrl:data.imageUrl,
    books:[data.answer1,data.answer2,data.answer3,data.answer4]
}];
console.dir(quizData);
quizData.selectGame=selectGame;
React.render(<Quiz data={quizData}/>,document.getElementById('app'));
}

//return consolidated data of Add Form field
function getRefs(components)
{
    //React.findDOMNode is used to get data from refs.
    var results={};
    Object.keys(components.refs).forEach(function(d){
        results[d]=React.findDOMNode(components.refs[d]).value;
    });
    return results;
}



})();