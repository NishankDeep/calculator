
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
    btn[i].addEventListener("click",function(event){
          
        var exp=this.innerText;

        evaluatingExpression(exp)
       
    });
}

// eventListener added to keypress
document.addEventListener("keydown",function(event){
    var ky=event.key;
    if(ky=='(' || ky==')' || ky=='+' || ky=='-' || ky=='/' || ky=='%' || ky=='*' || ky=='^' || (!isNaN(ky))){
        evaluatingExpression(ky);
    }
    else if(ky=='Backspace'){
        evaluatingExpression('X');
    }

})

//function to find the result of the expression
function evaluatingExpression(exp){
    // simply used to keep a track of the opening and closing bracket
    if(exp=='('){
        countO++;
    }
    else if(exp==')'){
        countC++;
    }

    if(exp=='='){
        // to evaluate the entered expressionn
        if(countO!=countC){
            // will not give output for incomplete opening and closing bracket
            alert("Some Brackets Are Missing");
        }
        else{
            if(prev!=""){
                store.push(prev);
                prev="";
            }
            
            
            var temp=(convertToPostFix(store));//variable storing the evaluated value
            screenVal=temp.toString(); 

            if(screenVal=="nps"){
                //if any error occured during the evaluation of the expression 
                screen.value="Wrong Expression";
            }
            else{
                screen.value=screenVal;
            }

            store=[];
            prev=screenVal;
        }

    }
    else if(exp=='C'){
        // to completely remove the values written in the input area
        countC=0;
        countO=0;
        
        screen.value="";
        screenVal="";

        store=[];
        prev="";

        console.clear();
    }
    else if(exp=='X'){
        // to perform the single removal of the value from the input screen

        var temp=screenVal[screenVal.length-1];//store the end charachter displayed on the screen

        // if teh value displayed on the screen is single then remove it or else in other case remove the last value and display the rest
        if(screenVal.length==1){
            screenVal="";
            screen.value=screenVal;
        }
        else{
            screenVal=screenVal.slice(0,screenVal.length-1);
            screen.value=screenVal;
        }

        // if the delted value is either opening or closing bracket decrease its count
        if(temp=='('){
            countO--;
        }
        else if(temp==')'){
            countC--;
        }

        // as after deleting from the screen we also need to remove it from our original store array which will be used for calculation 
        if(store.length!=0 && prev==""){
            // if prev do not contain any element so we need to remove from our main storage array store

            // extract the last element
            temp=store.pop();

            // extract the substring except the last one
            temp=temp.slice(0,temp.length-1);

            // if it contain some value then add to previous
            if(temp!=''){
                prev=prev+temp;
            }

            // to check whether the last element is number or charachter if it is character then we will push back to the store array back or if it is number we will store in prev for further calculation
            var ch=store.pop();
            if(!isNaN(ch)){
                prev=prev+ch;
            }
            else{
                store.push(ch);
            }
        }
        else if(prev!=""){
            // if the prev have any number then we need to remove it from it only
            if(prev.length==1){
                prev="";
            }
            else{
                prev=prev.slice(0,prev.length-1);
            }
        }
            
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
            // when the enter value is any operator then we will add it our array store 
            if(prev!=""){
                store.push(prev);
            }
            store.push(exp);

            prev="";
        }
        else{
            // when any numeric value is entered
            if(exp=="pi"){
                exp="3.141592653589793238";
            }
            else if(exp=='e'){
                exp="2.718281828459"
            }

            prev=prev+exp;
        }

        // update the value to be displayed on the screen
        screenVal=screenVal+exp;
        screen.value=screenVal
    }
}

// function that will convert the given expression to posfixExpression
function convertToPostFix(screenVal){
    var stack=[];//store the brackets
    var ans=[];//store the postfix expression 

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
           
            // if the priority of the operator already existing in the stack is more than the present it will be first popped
            while((stack.length!=0) && (priority(stack[stack.length-1])>=priority(screenVal[i]))){
                ans.push(stack.pop());
            }

            // pushed the current operator in the stack
            stack.push(screenVal[i]);
        }
        else{
            ans.push(screenVal[i]);
        }
    }

    // if the stack is not emptied then this loop will execute
    while(stack.length!=0){
        ans.push(stack.pop());
    }

    // store the value of the evaluated postfixexpression
    var res=evaluateExp(ans);

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
    var st=[];//used as stack to store the number and also the final ans

    for(var i=0;i<expression.length;i++){
        // console.log(st);
        if(expression[i]=='^' ||expression[i]=='+' || expression[i]=='-' || expression[i]=='/' || expression[i]=='%' || expression[i]=='*'){

            // if at any point the stack will contain one element then the evaluation is not possible it will return with no expression value
            if(st.length<=1){
                return "nps";
            }

            var a=st.pop();
            var b=st.pop();
            var an;

            // evaluation the value as per the expression 
            switch(expression[i]){
                case '+':
                    an=a+b;
                break;
                case '-':
                     an=b-a;
                break;

                case '/':
                    an=b/a;
                break;
                case '%':
                    an=b%a;
                break;

                case '*':
                    an=a*b;
                break;
                
                case '^':
                    an=Math.pow(b,a);
                break;
            }

            // pusing the evaluated ans
            st.push(an);
        }
        else{
            // parsing the value to float and then pushing to the stack array
            var temp=parseFloat(expression[i]);
            st.push(temp);
        }
    }

    // returnin the final ans if the above condition run successfully
    return st[0];
}
