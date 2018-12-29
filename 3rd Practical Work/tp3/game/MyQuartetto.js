class MyQuartetto{
    constructor(scene, cellSize){
        this.scene=scene;
        this.board= new MyBoard(this.scene,cellSize);
        this.piecesWhite=[new MyPiece(this.scene,1),new MyPiece(this.scene,1),new MyPiece(this.scene,1),new MyPiece(this.scene,1)];         
        this.piecesBlack=[new MyPiece(this.scene,0),new MyPiece(this.scene,0),new MyPiece(this.scene,0),new MyPiece(this.scene,0)]; 

        
    //STATE MACHINE//  
    this.state = {  
        WAITING_FOR_START: 0,
        CHOOSING_PIECE: 1,
        CHOOSING_MOVE: 2,
        PIECE_MOVING: 3,
        WON_GAME:4,
        // QUIT_GAME: 5,
        MOVIE: 6,
        // CONNECTION_ERROR: 10,
    };
    
    
    this.mode = { 
        PLAYER_VS_PLAYER: 0,
        PLAYER_VS_BOT: 1,
        BOT_VS_PLAYER: 2,
        BOT_VS_BOT: 3
      };

      
    this.currentState = this.state.WAITING_FOR_START;
    this.previousState = this.state.WAITING_FOR_START;

     //\STATE MACHINE//  

    this.pickedPiece=null;
    this.totalTime =0;
    }

    start(gamemode,level){
        var graph=this.scene.graph;
        for(let i=0;i<4;i++){ 
            graph.nodes[graph.root].addLeaf(new MyLeaf(graph,"piece",this.piecesBlack[i]))
            graph.nodes[graph.root].addLeaf(new MyLeaf(graph,"piece",this.piecesWhite[i]))
        }
        this.game_mode=gamemode;
        getInitBoard(this.setBoardMatrix.bind(this));
        this.currentState=this.state.CHOOSING_PIECE;
    }

    
    update_pieces(){
        let matrix=this.matrix;
        let whiteCounter=0;
        let blackCounter=0;
        for(let i=0; i<BOARD_SIZE;i++){
            for(let j=0;j<BOARD_SIZE;j++){
                if(matrix[i][j]==1){  
                    this.piecesWhite[whiteCounter].setPosition(this.board.translations[i][j]);
                    whiteCounter++;
                }
                else if(matrix[i][j]==2){  
                    this.piecesBlack[blackCounter].setPosition(this.board.translations[i][j]);
                    blackCounter++;
                }
            }}
    }



    handlePick(customId,obj){   
    console.log(this.currentState)    
        if(this.currentState==this.state.PIECE_MOVING)
            console.log("Moving piece")        
        else if(this.currentState==this.state.CHOOSING_PIECE ||
          (this.currentState==this.state.CHOOSING_MOVE && obj instanceof MyPiece && obj!=this.pickedPiece )){ //caso em que é para escolher peça
            let piece=Math.trunc(customId/1000);
            if (piece==1 || piece==2){
                this.board.clearValid();
                getValidMoves( JSON.stringify(this.matrix), Math.trunc(customId%100/10), customId%10,this.getMoves.bind(this));
                this.pickedPiece=obj;
            }
           
        }
        else if(this.currentState==this.state.CHOOSING_MOVE){
            if(obj==this.pickedPiece){    //caso em que des-selecciona a peça
                this.board.clearValid();
                this.pickedPiece=null
                this.previousState=this.currentState
                this.currentState=this.state.CHOOSING_PIECE   
            }
            else{     //caso em que é para escolher jogada possível
                if(obj instanceof MyCell){
                    if(obj.moveable){
                        this.pickedPiece.move(customId)
                        this.previousState=this.currentState
                        this.currentState=this.state.PIECE_MOVING
                        this.board.clearValid();
                    }
                    else{
                        //imprimir mensagem "you can only move to red cells"
                    }      
                }

            }
        }       
    }
    
    //BINDABLE FUNCTIONS
    getMoves(data){
        var response = JSON.parse(data.target.response);
        this.board.pickableCells(response);    
        //STATE MACHINE//
        this.previousState=this.currentState;
        this.currentState=this.state.CHOOSING_MOVE;
    }   

    setBoardMatrix(data){
        var response = JSON.parse(data.target.response);
        this.matrix=response;
        this.update_pieces();
    }   
    /////////////////////
    
    display(){
        for(let i=0;i<4;i++){          
            this.piecesBlack[i].display();  
            this.piecesWhite[i].display();
        }
        this.board.display();
    }
}