"use strict"

var gl;
var program;

var initialClickPositionX = 0;
var initialClickPositionY = 0;
var isMouseDown = false;
var clickedGridBlockX = 0;
var clickedGridBlockY = 0;

var fieldElements;

var dispositionInformation = new Int32Array(3);

const blockSize = 64;

function main(evt){
    window.removeEventListener(evt.type, setupWebGL, false);
    setupControls();
    setupWebGL();
}

function setupWebGL () {
    if (!(gl = getRenderingContext()))
        return;


    // setup GLSL program

    var source = document.querySelector("#vertex-shader").innerHTML;
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,source);
    gl.compileShader(vertexShader);
    source = document.querySelector("#fragment-shader").innerHTML;
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,source);
    gl.compileShader(fragmentShader);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        var linkErrLog = gl.getProgramInfoLog(program);
        cleanup();
        console.log("Shader program did not link successfully. "
            + "Error log: " + linkErrLog);
            
        return;
    }


    //const vertexIdLoc = gl.getAttribLocation(program, 'vertexId');
    const resolutionLoc = gl.getUniformLocation(program, 'resolution');
    const fieldLayoutLoc = gl.getUniformLocation(program, 'fieldLayout');
    const dispositionInformationLoc = gl.getUniformLocation(program, 'dispositionInformation');

    // Make a buffer with just a count in it.

    const numVerts = 4;
    //const vertexIds = new Float32Array(numVerts);
    //vertexIds.forEach((v, i) => {
    //    vertexIds[i] = i;
    //});

    fieldElements = new Float32Array(16);
    fieldElements.forEach((v, i) => {
        fieldElements[i] = i;
    });

    Shuffle(fieldElements);

    
    dispositionInformation[0] = 1;
    dispositionInformation[1] = 0;
    dispositionInformation[2] = 0;

    //const idBuffer = gl.createBuffer();
    //gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
    //gl.bufferData(gl.ARRAY_BUFFER, vertexIds, gl.STATIC_DRAW);

    // draw
    function render(timeStamp) {
        var canvas = document.getElementById("canvas");
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    
        gl.useProgram(program);
    
        //{
        //  // Turn on the attribute
        //    gl.enableVertexAttribArray(vertexIdLoc);
        //
        //    // Bind the id buffer.
        //    gl.bindBuffer(gl.ARRAY_BUFFER, idBuffer);
        //
        //    // Tell the attribute how to get data out of idBuffer (ARRAY_BUFFER)
        //    const size = 1;          // 1 components per iteration
        //    const type = gl.FLOAT;   // the data is 32bit floats
        //    const normalize = false; // don't normalize the data
        //    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
        //    const offset = 0;        // start at the beginning of the buffer
        //    gl.vertexAttribPointer(vertexIdLoc, size, type, normalize, stride, offset);
        //}
        
        // tell the shader the resolution
        gl.uniform2f(resolutionLoc, gl.canvas.width, gl.canvas.height);

        gl.uniformMatrix4fv(fieldLayoutLoc, false, fieldElements);

        gl.uniform3iv(dispositionInformationLoc, dispositionInformation);

        gl.drawArrays(gl.TRIANGLE_FAN, 0, numVerts);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    return;
        

//            gl.disable(gl.BLEND);
//            gl.disable(gl.CULL_FACE);
//            gl.disable(gl.DEPTH_TEST);
//            gl.disable(gl.DITHER);
//            gl.disable(gl.POLYGON_OFFSET_FILL);
//            gl.disable(gl.SAMPLE_ALPHA_TO_COVERAGE);
//            gl.disable(gl.SAMPLE_COVERAGE);
//            gl.disable(gl.SCISSOR_TEST);
//            gl.disable(gl.STENCIL_TEST);

        cleanup();
    }

    var buffer;
    function initializeAttributes() {
//            gl.enableVertexAttribArray(0);
//            buffer = gl.createBuffer();    
//            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
//            gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
    }

    function Shuffle(array2D) {
        for (var i = 0; i < array2D.length; i++) {
            var randomIdx1 = Math.floor(Math.random() * (i + 1));
            var temp = array2D[i];
            array2D[i] = array2D[randomIdx1];
            array2D[randomIdx1] = temp;
        }
        return array2D
    }

function iMod(x, N){
    return (x % N + N) %N;
}

function setupControls(){
    function onMouseMove(e) {
        if(window.TouchEvent && e instanceof TouchEvent){
            e = e.touches[0];
        }
        if(!isMouseDown) return;

        const rect = canvas.getBoundingClientRect();

        var mouseX = e.clientX - rect.left;
        var mouseY = e.clientY - rect.top;

        if(Math.abs(mouseX - initialClickPositionX) > Math.abs(mouseY - initialClickPositionY)){
            dispositionInformation[0] = 1;
            dispositionInformation[1] = clickedGridBlockY;
            dispositionInformation[2] = mouseX - initialClickPositionX;
        }else{
            dispositionInformation[0] = 0;
            dispositionInformation[1] = clickedGridBlockX;
            dispositionInformation[2] = mouseY - initialClickPositionY;
        }
        

        
        // initialClickPositionX = mouseX;
        // initialClickPositionY = mouseY;
    }

    function onMouseDown(e) {
        if(window.TouchEvent && e instanceof TouchEvent){
            e = e.touches[0];
        }

        const rect = canvas.getBoundingClientRect();

        initialClickPositionX = e.clientX - rect.left;
        initialClickPositionY = e.clientY - rect.top;


        var xFragCoord = Math.trunc(initialClickPositionX - Math.trunc(rect.width / 2.0));
        var yFragCoord = Math.trunc(initialClickPositionY - Math.trunc(rect.height  / 2.0));

        var xGridIndex = Math.trunc(xFragCoord / 64);
        xGridIndex = (xFragCoord) < 0 ? xGridIndex - 1 : xGridIndex;
        var yGridIndex = Math.trunc(yFragCoord / 64);
        yGridIndex = (yFragCoord) < 0 ? yGridIndex - 1 : yGridIndex;

        clickedGridBlockX = iMod(xGridIndex, 4);
        clickedGridBlockY = iMod(yGridIndex, 4);


        isMouseDown = true;
    }
    function onMouseUp(e) {
        if(window.TouchEvent && e instanceof TouchEvent){
            e = e.touches[0];
        }

        function vecRot(arr, rotateAmount, length){
            // Storing rotated version of array
            var temp = new Int32Array(length);
                
            // Keeping track of the current index
            // of temp[]
            var k = 0;
                
            // Storing the n - d elements of
            // array arr[] to the front of temp[]
            for (var i = rotateAmount; i < length; i++) {
                temp[k] = arr[i];
                k++;
            }
        
            // Storing the first d elements of array arr[]
            //  into temp
            for (var i = 0; i < rotateAmount; i++) {
                temp[k] = arr[i];
                k++;
            }
        
            // Copying the elements of temp[] in arr[]
            // to get the final rotated array
            for (var i = 0; i < length; i++) {
                arr[i] = temp[i];
            }
        }
        function matRot(matrix, columnOrRow, rowIndex, rotateAmount){
            // Storing rotated version of array
            var temp = new Int32Array(4);
            
            if(columnOrRow != 0){
                for(var i = 0; i < 4; i++){
                    temp[i] = matrix[rowIndex * 4 + i];
                }

                vecRot(temp, rotateAmount, 4);

                for(var i = 0; i < 4; i++){
                    matrix[rowIndex * 4 + i] = temp[i];
                }
            }else{
                for(var i = 0; i < 4; i++){
                    temp[i] = matrix[i * 4 + rowIndex];
                }

                vecRot(temp, rotateAmount, 4);

                for(var i = 0; i < 4; i++){
                    matrix[i * 4 + rowIndex] = temp[i];
                }
            }


        }

        isMouseDown = false;
        
        var rotateAmount = Math.round(-dispositionInformation[2] / 64);
        rotateAmount = iMod(rotateAmount, 4);

        matRot(fieldElements, dispositionInformation[0], dispositionInformation[1], rotateAmount);

        dispositionInformation[0] = 0;
        dispositionInformation[1] = 0;
        dispositionInformation[2] = 0;

    }

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mouseup', onMouseUp);

    canvas.addEventListener('touchmove', onMouseMove);
    canvas.addEventListener('touchstart', onMouseDown);
    canvas.addEventListener('touchend', onMouseUp);
}

function cleanup() {
    gl.useProgram(null);
    if (buffer)
        gl.deleteBuffer(buffer);
    if (program) 
        gl.deleteProgram(program);
}

function getRenderingContext() {
    var canvas = document.getElementById("canvas");
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    var gl = canvas.getContext("webgl2") 
    if(gl == null){
        gl = canvas.getContext("experimental-webgl");
    }
    if (gl == null) {
        return null;
    }
    //gl.viewport(0, 0);
        //gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    //gl.clipControl(gl.UPPER_LEFT, gl.ZERO_TO_ONE)
    return gl;
}