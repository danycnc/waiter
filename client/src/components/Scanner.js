// import { Html5QrcodeScanner } from 'html5-qrcode';

// // To use Html5Qrcode (more info below)
// import { Html5Qrcode } from 'html5-qrcode';
// import { useEffect } from 'react';
// import { useDispatch } from 'react-redux';
// import { scannedQRSlicer } from '../slicers/scannedQRSlicer';

// const Scanner = () => {
//   const dispatch = useDispatch();
//   useEffect(() => {
//     const html5QrCode = new Html5Qrcode('reader');
//     const qrCodeSuccessCallback = (decodedText, decodedResult) => {
//       dispatch(scannedQRSlicer.actions.populate(decodedText));
//       html5QrCode.stop();
//     };
//     const config = { fps: 10, qrbox: { width: 250, height: 250 } };

//     // If you want to prefer front camera
//     html5QrCode.start(
//       { facingMode: 'environment' },
//       config,
//       qrCodeSuccessCallback
//     );
//   }, []);

//   // beware: id must be the same as the first argument of Html5QrcodeScanner
//   return <div id='reader'></div>;
// };

// export default Scanner;
