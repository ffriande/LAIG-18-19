class MyQuartetto{
    constructor(scene, cellSize){
        this.scene=scene;
        this.board= new MyBoard(this.scene,cellSize);
        this.piecesWhite=[new MyPiece(this.scene),new MyPiece(this.scene),new MyPiece(this.scene),new MyPiece(this.scene)];         
        this.piecesBlack=[new MyPiece(this.scene),new MyPiece(this.scene),new MyPiece(this.scene),new MyPiece(this.scene)];         
   
        this.update_pieces();
    }

    update_pieces(){
        let matrix=this.board.matrix;
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

    display(){
        this.board.display();
        for(let i=0;i<4;i++){
            this.piecesBlack[i].display();
            this.piecesWhite[i].display();
        }
    }
}