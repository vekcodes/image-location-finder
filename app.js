// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", function () {
  const imageInput = document.getElementById("imageInput");
  const status = document.getElementById("status");

  // Trigger processImage when a file is selected
  imageInput.addEventListener("change", function () {
      processImage(imageInput.files[0]);
  });

  function processImage(file) {
      if (!file) {
          status.textContent = "Please select an image.";
          return;
      }

      const reader = new FileReader();

      reader.onload = function (e) {
          const arrayBuffer = e.target.result;

          // Extract GPS data from the image
          try {
              const exif = EXIF.readFromBinaryFile(arrayBuffer);
              if (exif && exif.GPSLatitude && exif.GPSLongitude) {
                  const lat = toDecimal(exif.GPSLatitude, exif.GPSLatitudeRef);
                  const lng = toDecimal(exif.GPSLongitude, exif.GPSLongitudeRef);
                  status.textContent = "Gotcha!!!";
                  initMap(lat, lng);
              } else {
                  status.textContent = "OHH shoot you're unpredictable!! . Try another image";
              }
          } catch (err) {
              status.textContent = "Error reading EXIF data.";
              console.error("EXIF Read Error:", err);
          }
      };

      reader.onerror = function () {
          status.textContent = "Error reading the file.";
      };

      reader.readAsArrayBuffer(file);
  }

  function toDecimal(coord, ref) {
      let decimal = coord[0] + coord[1] / 60 + coord[2] / 3600;
      if (ref === "S" || ref === "W") decimal *= -1;
      return decimal;
  }

  function initMap(lat, lng) {
      const map = new google.maps.Map(document.getElementById("map"), {
          center: { lat, lng },
          zoom: 15,
      });
      new google.maps.Marker({
          position: { lat, lng },
          map,
      });
  }
});
 