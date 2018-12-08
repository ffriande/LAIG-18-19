class MyBoard extends CGFobject {
    constructor(scene,size_per_cell){
        super(scene);
        this.size_per_cell=size_per_cell;
        // this.plane = new MyPlane(this.scene, 40,40);
        this.matrix =
            [[0,0,1,1,1,1,0,0,],
            [0,0,0,0,0,0,0,0,0 ],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0],
            [0,0,2,2,2,2,0,0],];

        this.translations = [];
        let rowTrans=[];
        for(let i=0; i<BOARD_SIZE;i++){
            for(let j=0;j<BOARD_SIZE;j++){
                rowTrans.push(
                    [this.size_per_cell*j + this.size_per_cell/2,
                     0,
                     this.size_per_cell*i + this.size_per_cell/2]
                    );
            }
            this.translations.push(rowTrans);
            rowTrans=[];
        }

        this.make_cells();
    }

    make_cells() {
        this.cells=[];
        var cntr=1;
        for(let i=0; i<BOARD_SIZE;i++){
            for(let j=0;j<BOARD_SIZE;j++){
                this.cells.push(new MyCell(this.scene,this.size_per_cell
                ,j*this.size_per_cell,i*this.size_per_cell,cntr%2));
                cntr++;
            }
         cntr++;
         }
   
    }

    display(){
        let j;
        let indexR;
        let indexC;
        let index;
        for(let i=0; i<this.cells.length;i++){
            j=i+1;
            indexR=Math.ceil(j/BOARD_SIZE);
            if((indexC=(j%BOARD_SIZE))==0)
                indexC=BOARD_SIZE;
            index=indexR*10 + indexC;
            this.scene.registerForPick(index, this.cells[i]);
            this.cells[i].display();
        }
    }
}