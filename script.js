function validateNumber(min, max, val) {
  num = Number(val)
  if(isNaN(val))
    return NaN;

  val = Math.round(num);
  if(val < min)
    return min;
  if(val > max)
    return max;
  return val;
}


function validateHexColor(hex) {
  if(hex[0] == "#")
    hex = hex.slice(1)
  const hexColorPattern = /^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3}|[A-Fa-f0-9]{1,2})$/;
  if(hexColorPattern.test(hex))
  {
    if(hex.length == 1)
      hex = hex+hex+hex+hex+hex+hex;
    if(hex.length == 2)
      hex = hex+hex+hex;
    return hex;
  }
  else
    return "NaN";
}


function hexToRgb(hex) {
  hex = hex.toString().slice(1);
  const hexValue = parseInt(hex, 16);
  const red = (hexValue >> 16) & 255;
  const green = (hexValue >> 8) & 255;
  const blue = hexValue & 255;
  return {
    r: red,
    g: green,
    b: blue
  };
}


function rgbToHex(r, g, b) {
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');
  const hexColor = `#${hexR}${hexG}${hexB}`;
  return hexColor;
}


function cmykToHex(c, m, y, k) {
  const r = Math.round(0.0255 * (100 - c) * (100 - k));
  const g = Math.round(0.0255 * (100 - m) * (100 - k));
  const b = Math.round(0.0255 * (100 - y) * (100 - k));
  return rgbToHex(r, g, b);
}


function rgbToCmyk(r, g, b) {
  const c = 1 - r / 255;
  const m = 1 - g / 255;
  const y = 1 - b / 255;
  const k = Math.min(c, m, y);
  if (Math.abs(k - 1) < 0.005) {
      return { c: 0, m: 0, y: 0, k: 100 };
  }
  return {
      c: 100*(c - k) / (1 - k),
      m: 100*(m - k) / (1 - k),
      y: 100*(y - k) / (1 - k),
      k: 100*k
  };
}


function rgbToHsv(r, g, b) {
  r = r / 255;
  g = g / 255;
  b = b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  let h, s, v;

  if (delta === 0) {
    h = 0;
  } else if (max === r) {
    h = ((g - b) / delta) % 6;
  } else if (max === g) {
    h = (b - r) / delta + 2;
  } else {
    h = (r - g) / delta + 4;
  }

  h = Math.round((h * 60 + 360) % 360);

  if (max === 0) {
    s = 0;
  } else {
    s = Math.round((delta / max) * 100);
  }

  v = Math.round(max * 100);

  return { h, s, v };
}


function hsvToRgb(h, s, v) {
  const c = (v / 100) * (s / 100);
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = (v / 100) - c;

  let r, g, b;

  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else {
    r = c;
    g = 0;
    b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return { r, g, b };
}


//////
const colorPicker = new window.iro.ColorPicker(".color-picker", {
  layout: [
    { 
      component: iro.ui.Box,
      options: {
        width: 250
      }
    },
    { 
      component: iro.ui.Slider,
      options: {
        sliderType: 'hue',
        width: 250
      }
    },
  ],
  color: "#ff0000"
});


//RGB
const fieldA = document.getElementById("fieldA");
const fieldB = document.getElementById("fieldB");
const fieldC = document.getElementById("fieldC");
const fieldD = document.getElementById("fieldD");
const hexField = document.getElementById("hexField");
const fields = document.getElementById('fields');

const wrapperA = document.getElementById("wrapperA");
const wrapperB = document.getElementById("wrapperB");
const wrapperC = document.getElementById("wrapperC");
const wrapperD = document.getElementById("wrapperD");

const labelA = document.getElementById("labelA");
const labelB = document.getElementById("labelB");
const labelC = document.getElementById("labelC");

const sliderA = document.getElementById("sliderA");
const sliderB = document.getElementById("sliderB");
const sliderC = document.getElementById("sliderC");
const sliderD = document.getElementById("sliderD");
const sliders = document.getElementById('sliders');

const swrapperA = document.getElementById("swrapperA");
const swrapperB = document.getElementById("swrapperB");
const swrapperC = document.getElementById("swrapperC");
const swrapperD = document.getElementById("swrapperD");

const inputs = document.querySelectorAll('.inputs');
inputs.forEach(function(input) {
  input.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      input.blur();
    }
  });
  input.addEventListener('focus', function() {
    input.select();
  });
  input.addEventListener('blur', function() {
    syncColorPicker();
  });
  input.addEventListener('dragstart', function (e) {
    e.preventDefault();
  });
});

let previousModel = "rgb-fields"
const modelSelector = document.getElementById("color-model-selector");
const selectedColorDiv = document.querySelector(".selected-color-div");
const warning = document.getElementById("warning");

colorPicker.on('color:init', function(color) {
  colorPicker.color.hexString;
  syncFields();
});

colorPicker.on('color:change', function(color) {
  syncFields();
});

function syncFields() {
  selectedColorDiv.style.backgroundColor = colorPicker.color.rgbString;
  switch (modelSelector.value) {
    case "rgb":
      setRGB();
      break;
    case "hex":
      setHEX();
      break;
    case "cmyk":
      setCMYK();
      break;
    case "hsv":
      setHSV();
      break;
    case "hsl":
      setHSL();
      break;
    default:
      break;
  }
}

function syncColorPicker() {
  switch (modelSelector.value) {
    case "rgb":
      validateRGB();
      break;
    case "hex":
      validateHex();
      break;
    case "cmyk":
      validateCMYK();
      break;
    case "hsv":
      validateHSV();
      break;
    case "hsl":
      validateHSL();
    break;
    default:
      break;
  }
  selectedColorDiv.style.backgroundColor = colorPicker.color.hexString;
}


//RGB
function setRGB() {
  fieldA.value = colorPicker.color.red;
  fieldB.value = colorPicker.color.green;
  fieldC.value = colorPicker.color.blue;

  sliderA.value = fieldA.value;
  sliderB.value = fieldB.value;
  sliderC.value = fieldC.value;
}

function validateRGB() {
  r = validateNumber(0, 255, fieldA.value)
  g = validateNumber(0, 255, fieldB.value)
  b = validateNumber(0, 255, fieldC.value)
  if(!(isNaN(r) || isNaN(g) || isNaN(b))) {
    let col = new window.iro.Color({r:r, g:g, b:b});
    colorPicker.color.hexString = col.hexString;
  }
  setRGB();
}


//HEX
function setHEX() {
  hexField.value = colorPicker.color.hexString;
}

function validateHex() {
  h = validateHexColor(hexField.value);
  if(h != "NaN")
    colorPicker.color.hexString = h;
  setHEX();
}


//CMYK
function setCMYK() {
  const cmyk = rgbToCmyk(
    colorPicker.color.red, 
    colorPicker.color.green, 
    colorPicker.color.blue);
    
  fieldA.value = Math.round(cmyk.c);
  fieldB.value = Math.round(cmyk.m);
  fieldC.value = Math.round(cmyk.y);
  fieldD.value = Math.round(cmyk.k);

  sliderA.value = fieldA.value;
  sliderB.value = fieldB.value;
  sliderC.value = fieldC.value;
  sliderD.value = fieldD.value;
}


function validateCMYK() {
  const c = validateNumber(0, 100, fieldA.value);
  const m = validateNumber(0, 100, fieldB.value);
  const y = validateNumber(0, 100, fieldC.value);
  const k = validateNumber(0, 100, fieldD.value);
  console.log(c + " " + m + " " + y + " " + k);
  if (!(isNaN(c) || isNaN(m) || isNaN(y) || isNaN(k)))
    colorPicker.color.hexString = cmykToHex(c, m, y, k);

  setCMYK();
}


//HSV
function setHSV() {
  fieldA.value = Math.round(colorPicker.color.hsv.h);
  fieldB.value = Math.round(colorPicker.color.hsv.s);
  fieldC.value = Math.round(colorPicker.color.hsv.v);

  sliderA.value = fieldA.value;
  sliderB.value = fieldB.value;
  sliderC.value = fieldC.value;
}

function validateHSV() {
  const h = validateNumber(0, 360, fieldA.value);
  const s = validateNumber(0, 100, fieldB.value);
  const v = validateNumber(0, 100, fieldC.value);

  if (!isNaN(h) && !isNaN(s) && !isNaN(v)) {
    let col = new window.iro.Color({h:h, s:s, v:v});
    colorPicker.color.hsv = col.hsv;
  }

  setHSV();
}


//HSL
function setHSL() {
  fieldA.value = Math.round(colorPicker.color.hsl.h);
  fieldB.value = Math.round(colorPicker.color.hsl.s);
  fieldC.value = Math.round(colorPicker.color.hsl.l);

  sliderA.value = fieldA.value;
  sliderB.value = fieldB.value;
  sliderC.value = fieldC.value;
}

function validateHSL() {
  h = validateNumber(0, 360, fieldA.value);
  s = validateNumber(0, 100, fieldB.value);
  l = validateNumber(0, 100, fieldC.value);

  if (!isNaN(h) && !isNaN(s) && !isNaN(l)) {
    let col = new window.iro.Color({h:h, s:s, l:l});
    colorPicker.color.hsl = col.hsl;
  }

  setHSL();
}



modelSelector.addEventListener('change', () => {
  const selectedModel = modelSelector.value;
  fields.style.width = "200px";
  if(selectedModel != "hex" &&  selectedModel != "cmyk")
  {
    wrapperA.classList.remove('hidden');
    wrapperB.classList.remove('hidden');
    wrapperC.classList.remove('hidden');
    wrapperD.classList.add('hidden');
    hexField.classList.add('hidden');

    swrapperA.classList.remove('hidden');
    swrapperB.classList.remove('hidden');
    swrapperC.classList.remove('hidden');
    swrapperD.classList.add('hidden');

    sliderA.max = sliderB.max = sliderC.max = 255;

    labelA.textContent = "R"
    labelB.textContent = "G"
    labelC.textContent = "B"
  }
  else if(selectedModel == "hex")
  {
    wrapperA.classList.add('hidden');
    wrapperB.classList.add('hidden');
    wrapperC.classList.add('hidden');
    wrapperD.classList.add('hidden');

    swrapperA.classList.add('hidden');
    swrapperB.classList.add('hidden');
    swrapperC.classList.add('hidden');
    swrapperD.classList.add('hidden');

    hexField.classList.remove('hidden');
  }
  else
  {
    wrapperA.classList.remove('hidden');
    wrapperB.classList.remove('hidden');
    wrapperC.classList.remove('hidden');
    wrapperD.classList.remove('hidden');
    hexField.classList.add('hidden');

    swrapperA.classList.remove('hidden');
    swrapperB.classList.remove('hidden');
    swrapperC.classList.remove('hidden');
    swrapperD.classList.remove('hidden');

    labelA.textContent = "C"
    labelB.textContent = "M"
    labelC.textContent = "Y"

    fields.style.width = "260px";
  }

  if(selectedModel == "cmyk")
    sliderA.max = sliderB.max = sliderC.max = sliderD.max = 100;

  if(selectedModel == "hsv" || selectedModel == "hsl") {
    sliderA.max = 360;
    sliderB.max = sliderC.max = 100;

    labelA.textContent = "H"
    labelB.textContent = "S"
    if(selectedModel == "hsv")
      labelC.textContent = "V"
    else
      labelC.textContent = "L"
  }

  syncFields()
});


sliderA.oninput = function() {
  fieldA.value = this.value
  syncColorPicker();
}

sliderB.oninput = function() {
  fieldB.value = this.value
  syncColorPicker();
}

sliderC.oninput = function() {
  fieldC.value = this.value
  syncColorPicker();
}

sliderD.oninput = function() {
  fieldD.value = this.value
  syncColorPicker();
}


var colorDiv = document.getElementById("colorDiv");

colorDiv.addEventListener("click", function(event) {
  var textToCopy = "";
  switch (modelSelector.value) {
    case "rgb":
      textToCopy = colorPicker.color.rgbString;
      break;
    case "hex":
      textToCopy = colorPicker.color.hexString;
      break;
    case "cmyk":
      textToCopy = "cmyk(" +
       fieldA.value + "%, " + 
       fieldB.value + "%, " + 
       fieldC.value + "%, " + 
       fieldD.value + "%)";
      break;
    case "hsv":
      textToCopy = "hsv(" +
       fieldA.value + ", " + 
       fieldB.value + "%, " + 
       fieldC.value + "%)";
      break;
    case "hsl":
      textToCopy = "hsl(" +
       fieldA.value + ", " + 
       fieldB.value + "%, " + 
       fieldC.value + "%)";
      break;
    default:
      break;
  }
  navigator.clipboard.writeText(textToCopy);
  navigator.clipboard.writeText(textToCopy);
});