
var btn=document.querySelectorAll(".btnSize"); //selected all buttons
var n=btn.length;//calculate total number of button

var screen=document.querySelector("#nbr");//selected the input 

var screenVal=""; //will store the value to be displayed on the screen

//to keep track of bracket
var countO=0;
var countC=0;

var store=[]; //to store the string values for evaluation
var prev=""; //to store numeric value;


//iterating to all the buttons
for(var i=0;i<n;i++){
    // console.log(btn[i].innerHTML);
    btn[i].addEventListener("click",function(event){
          
        var exp=this.innerText;

        evaluatingExpression(exp)
       
    });
}

// eventListener added to keypress
document.addEventListener("keydown",function(event){
    // console.log(event);
    var ky=event.key;
    if(ky=='(' || ky==')' || ky=='+' || ky=='-' || ky=='/' || ky=='%' || ky=='*' || ky=='^' || (!isNaN(ky))){
        evaluatingExpression(ky);
    }
    // else if(ky=='Enter'){
    //     evaluatingExpression('=');
    // }
    else if(ky=='Backspace'){
        evaluatingExpression('X');
    }

})

//function to find the result of the expression
function evaluatingExpression(exp){
    if(exp=='('){
        countO++;
    }
    else if(exp==')'){
        countC++;
    }

    if(exp=='='){
        if(countO!=countC){
            // Brackets are unequal
            alert("Some Brackets Are Missing");
        }
        else{
            if(prev!=""){
                store.push(prev);
                prev="";
            }
            // console.log(screenVal);
            
            // screenVal=eval(screenVal);
            var temp=(convertToPostFix(store));
            screenVal=temp.toString();

            // console.log(screenVal)
            if(screenVal=="nps"){
                screen.value="Wrong Expression";
            }
            else{
                screen.value=screenVal;
            }

            store=[];
            prev=screenVal;
            // store.push(screenVal);
        }

    }
    else if(exp=='C'){
        countC=0;
        countO=0;
        
        screen.value="";
        screenVal="";

        // ans=[];
        store=[];
        prev="";

        console.clear();
    }
    else if(exp=='X'){
        var temp=screenVal[screenVal.length-1];
        // console.log(store);
        // console.log(screenVal);
        if(screenVal.length==1){
            screenVal="";
            screen.value=screenVal;
        }
        else{
            screenVal=screenVal.slice(0,screenVal.length-1);
            screen.value=screenVal;
        }

        if(temp=='('){
            countO--;
        }
        else if(temp==')'){
            countC--;
        }

        if(store.length!=0 && prev==""){

            temp=store.pop();
            temp=temp.slice(0,temp.length-1);
            if(temp!=''){
                prev=prev+temp;
            }


            var ch=store.pop();
            if(!isNaN(ch)){
                prev=prev+ch;
            }
            else{
                store.push(ch);
            }

        }
        else if(prev!=""){
            if(prev.length==1){
                prev="";
            }
            else{
                prev=prev.slice(0,prev.length-1);
            }
        }
            
        // console.log("##");
        // console.log(store);
        // console.log(screenVal);
    }
    else{
        if(exp=='(' || exp==')'){
            if(prev!=""){
                store.push(prev);
                prev="";
            }
            store.push(exp);
        }
        else if(exp=='+' || exp=='-' || exp=='/' || exp=='%' || exp=='*' || exp=='^'){
            if(prev!=""){
                store.push(prev);
            }
            store.push(exp);

            prev="";
        }
        else{
            if(exp=="pi"){
                exp="3.141592653589793238";
            }
            else if(exp=='e'){
                exp="2.718281828459"
            }

            prev=prev+exp;
        }

        screenVal=screenVal+exp;
        screen.value=screenVal
    }
}

// function that will convert the given expression to posfixExpression
function convertToPostFix(screenVal){
    // console.log(screenVal);
    // console.log("##");
    var stack=[];
    var ans=[];

    for(var i=0;i<screenVal.length;i++){
        if(screenVal[i]=='('){
            stack.push(screenVal[i]);
        }
        else if(screenVal[i]==')'){

            while((stack.length!=0) && (stack[stack.length-1]!='(')){
                ans.push(stack.pop())
            }

            stack.pop();
        }
        else if(screenVal[i]=='^' ||screenVal[i]=='+' || screenVal[i]=='-' || screenVal[i]=='/' || screenVal[i]=='%' || screenVal[i]=='*'){
            
            while((stack.length!=0) && (priority(stack[stack.length-1])>=priority(screenVal[i]))){
                ans.push(stack.pop());
            }

            stack.push(screenVal[i]);
        }
        else{
            ans.push(screenVal[i]);
        }
    }

    while(stack.length!=0){
        ans.push(stack.pop());
    }

    // console.log(ans);

    var res=evaluateExp(ans);
    // console.log(res);
    return res;
}

//return the priority of the symbols
function priority(symbol){
    if(symbol=="+" || symbol=="-"){
        return 1;
    }
    else if(symbol=="/" || symbol=="*"){
        return 2;
    }
    else if(symbol=="%"){
        return 3;
    }
    else if(symbol=='^'){
        return 4;
    }
    else{
        return 0;
    }
}


//evaluate the final expression;
function evaluateExp(expression){
    var st=[];

    for(var i=0;i<expression.length;i++){
        // console.log(st);
        if(expression[i]=='^' ||expression[i]=='+' || expression[i]=='-' || expression[i]=='/' || expression[i]=='%' || expression[i]=='*'){

            if(st.length<=1){
                return "nps";
            }
            var a=st.pop();
            var b=st.pop();
            var an;

            switch(expression[i]){
                case '+':
                    // a=st.pop();
                    // b=st.pop();
                    an=a+b;
                break;
                case '-':
                    // a=st.pop();
                    // b=st.pop();
                     an=b-a;
                break;

                case '/':
                    // a=st.pop();
                    // b=st.pop();
                    an=b/a;
                break;
                case '%':
                    // a=st.pop();
                    // b=st.pop();
                    an=b%a;
                break;

                case '*':
                    // a=st.pop();
                    // b=st.pop();
                    an=a*b;
                break;
                
                case '^':
                    // a=st.pop();
                    // b=st.pop();
                    an=Math.pow(b,a);
                    // console.log(an);
                break;
            }
            st.push(an);
        }
        else{
            var temp=parseFloat(expression[i]);
            st.push(temp);
        }
    }

    return st[0];
}
