import "./App.css";
import ImageSlider from "./Component/ImageSlider";
import pic1 from "./Images/1.jpg";
import pic2 from "./Images/2.jpg";
import pic3 from "./Images/3.jpg";
import pic4 from "./Images/4.jpg";

function App() {
  return (
    <div className="App">
      <div>
        <ImageSlider infinite timer={5000} stopOnManual>
          <img src={pic1} alt="" />
          <img src={pic2} alt="" />
          <img src={pic3} alt="" />
          <img src={pic4} alt="" />
        </ImageSlider>
      </div>
    </div>
  );
}

export default App;
