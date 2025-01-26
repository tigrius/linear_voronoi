const width = 512;
const height = 512;
const line_num = 100;

let line_data = [];
let color_data = [];

function setup(){

    createLines(line_num);

    createCanvas(width,height);
    background(0);
    let pink = color(0, 102, 204);
    let img = createImage(width, height);
    img.loadPixels() ;
    let fullImage = img.width * img.height *4 ;

    const pixels_score = calcurate_pixel_distance();

    for(let i = 0; i < fullImage; i += 4){
        const pixel_score = pixels_score[i/4];
        img.pixels [i] = red(color_data[pixel_score[1]]);        // 255
        img.pixels [i + 1] = green(color_data[pixel_score[1]]);  // 102
        img.pixels [i + 2] = blue(color_data[pixel_score[1]]);   // 204
        img.pixels [i + 3] = 256/(1+0.03*pixel_score[0]);  // 100
    }
    img.updatePixels() ;
    image(img, 0, 0);


    for (let i = 0; i < line_num; i++){
        const abc_data = line_data[i];
        const orientation_v = [-abc_data[0][1]*abc_data[2]/2,abc_data[0][0]*abc_data[2]/2]
        line(-orientation_v[0]+abc_data[1][0],-orientation_v[1]+abc_data[1][1],orientation_v[0]+abc_data[1][0],orientation_v[1]+abc_data[1][1]);
        stroke(color_data[i]);
    }
}

function draw() {

  }


function createPixelData(){

}

function createLines(n){
    const diagonal = (width**2 + height**2)**0.5;
    for(let i = 0; i<n;i++){
        const midpoint = [Math.random()*width,Math.random()*height];
        const length = Math.random()*diagonal/5;
        const theta = Math.random()*2*Math.PI;
        const a = Math.sin(theta);
        const b = -1*Math.cos(theta);
        let abc = [[a,b,-a*midpoint[0]-b*midpoint[1]],midpoint,length];
        line_data.push(abc);

        color_data.push(color(100+Math.floor(Math.random()*128),100+Math.floor(Math.random()*128),100+Math.floor(Math.random()*128)));
    }
}

function calculate_min_line_distance(coodinate,line_datum){
    const half_length = line_datum[2]/2;
    const a = line_datum[0][0];
    const b = line_datum[0][1];
    const c = line_datum[0][2];
    const sum = a*coodinate[0] + b*coodinate[1] + c;
    const foot = [coodinate[0]-sum*a,coodinate[1]-sum*b];
    const distance_to_mid = Math.sqrt((line_datum[1][0]-foot[0])**2+(line_datum[1][1]-foot[1])**2);
    if(distance_to_mid > half_length){
        const orientation_v = [-b*half_length,a*half_length]
        const upper_point = [orientation_v[0]+line_datum[1][0],orientation_v[1]+line_datum[1][1]];
        const bottom_point = [-orientation_v[0]+line_datum[1][0],-orientation_v[1]+line_datum[1][1]];
        return Math.min(calcurate_distance(coodinate,upper_point),calcurate_distance(coodinate,bottom_point));
    }else{
        return Math.abs(sum);
    }
}

function calcurate_pixel_distance(){
    let out = [];
    for(let i = 0; i < width; i++){
        for(let j = 0; j< height; j++){
            let score = 100000000;
            let id = 0;
            for(let k = 0; k < line_num;k++){
                const new_score = calculate_min_line_distance([j,i],line_data[k]);
                if(new_score < score){
                    score = new_score;
                    id = k;
                }
            }
            out.push([score,id]);
        }
    }
    return out;
}

function calcurate_distance(a,b){
    return Math.sqrt((a[0]-b[0])**2+(a[1]-b[1])**2);
}