(function($, window, undefined){

  Hangman = {
    init: function(words){
      this.words = words,
      this.hm = $(".hangman"),
      this.msg = $(".message"),
      this.msgTitle = $(".title"),
      this.msgText = $(".text"),
      this.restart = $(".restart"),
      this.wrd = this.randomWord(),
      this.correct = 0,
      this.guess = $(".guess"),
      this.wrong = $(".wrong"),
      this.wrongGuesses = [],
      this.rightGuesses = [],
      this.guessForm = $(".guessForm"),
      this.guessLetterInput = $(".guessLetter"),
      this.setup();
    },


    setup: function(){
      this.binding();
      this.showGuess(this.wrongGuesses);
      this.showWrong();
    },
    

    binding: function(){
      this.guessForm.on("submit", $.proxy(this.theGuess, this));
      this.restart.on("click", $.proxy(this.theRestart, this));
    },


    theRestart: function(e){
      e.preventDefault();
      this.reset();
    },


    theGuess: function(e){
      e.preventDefault();
      var guess = this.guessLetterInput.val();
      if(guess.match(/[a-zA-Z]/) && guess.length == 1){
        if($.inArray(guess, this.wrongGuesses) > -1 || $.inArray(guess, this.rightGuesses) > -1){
          this.guessLetterInput.val("").focus();
        }
        else if(guess) {
          var foundLetters = this.checkGuess(guess);
          if(foundLetters.length > 0){
            this.setLetters(foundLetters);
            this.guessLetterInput.val("").focus();
          } else {
            this.wrongGuesses.push(guess);
            if(this.wrongGuesses.length == 10){
              this.lose();
            } else {
              this.showWrong(this.wrongGuesses);
            }
            this.guessLetterInput.val("").focus();
          }
        }
      } else {
        this.guessLetterInput.val("").focus();
      }
    },

    randomWord: function(){
      return this._wordData(this.words[ Math.floor(Math.random() * this.words.length)] );
    },


    showGuess: function(){
      var frag = "<ul class='word'>";
      $.each(this.wrd.letters, function(key, val){
        frag += "<li data-pos='" +  key  + "' class='letter'>*</li>";
      });
      frag += "</ul>";
      this.guess.html(frag);
    },


    showWrong: function(wrongGuesses){
      if(wrongGuesses){
        var frag = "<ul class='wrongLetters'>";
        frag += "<p>Wrong Letters: </p>";
        $.each(wrongGuesses, function(key, val){
          frag += "<li>" + val + "</li>";
        });
        frag += "</ul>";
      }
      else {
        frag = "";
      }

      this.wrong.html(frag);
    },


    checkGuess: function(guessedLetter){
      var _ = this;
      var found = [];
      $.each(this.wrd.letters, function(key, val){
        if(guessedLetter == val.letter.toLowerCase()){
          found.push(val);
          _.rightGuesses.push(val.letter);
        }
      });
      return found;

    },


    setLetters: function(letters){
      var _ = this;
      _.correct = _.correct += letters.length;
      $.each(letters, function(key, val){
        var letter = $("li[data-pos=" +val.pos+ "]");
        letter.html(val.letter);
        letter.addClass("correct");

        if(_.correct  == _.wrd.letters.length){
          _.win();
        }
      });
    },


    _wordData: function(word){

      return {
        letters: this._letters(word),
        word: word.toLowerCase(),
        totalLetters: word.length
      };
    },


    hideMsg: function(){
      this.msg.hide();
      this.msgTitle.hide();
      this.restart.hide();
      this.msgText.hide();
    },


    showMsg: function(){
      var _ = this;
      _.msg.show("blind", function(){
        _.msgTitle.show("bounce", "slow", function(){
          _.msgText.show("slide", function(){
            _.restart.show("fade");
          });

        });

      });
    },


    reset: function(){
      this.hideMsg();
      this.init(this.words);
      this.hm.find(".guessLetter").focus();

    },


    _letters: function(word){
      var letters = [];
      for(var i=0; i<word.length; i++){
        letters.push({
          letter: word[i],
          pos: i
        });
      }
      return letters;
    },


    rating: function(){
      var right = this.rightGuesses.length,
          wrong = this.wrongGuesses.length || 0,
          rating = {
            rating: Math.floor(( right / ( wrong + right )) * 100),
            guesses: (right + wrong)
            
          };
      return rating;
    },

    win: function(){
      var rating = this.rating();
      this.msgTitle.html("Awesome, You Won!");
      this.msgText.html("You solved the word in <span class='highlight'>" + rating.guesses + "</span> Guesses!<br>Score: <span class='highlight'>" + rating.rating + "%</span>");
      this.showMsg();
        },


    lose: function(){
      this.msgTitle.html("You lost, the word was <span class='highlight'>"+ this.wrd.word +"</span>");
      this.msgText.html("Don't worry, you'll get it next time!");
      this.showMsg();
    }
  
  };

  var wordList = ["chrome", "firefox", "codepen", "javascript", "jquery", "facebook", "github", "instagram", "opera", "html", "syntax", "semantic", "designer", "developer", "node", "component", "website", "design", "banner", "browser", "screen", "mobile", "footer", "header", "typography", "responsive", "programmer", "CSS", "border", "font", "border", "navbar", "document", "object", "window", "array", "bootstrap", "jquery", "nodejs", "code", "engineering", "columbia", "element", "android", "application", "method", "apple", "google", "microsoft", "bing", "internet", "keypress", "keydown", "background", "property", "html", "coinbase", "network", "server", "content", "database", "bitcoin", "function", "variable", "link", "blockchain", "query", "validation", "console", "angular", "email", "youTube", "cloud"];

  Hangman.init(wordList);
  
})(jQuery, window);