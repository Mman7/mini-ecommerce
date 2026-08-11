# Upload Module

## Features

### Product Image

- Upload Image
- Update Image
- Delete Image

---

### File Validation

- Check File Type
- Check File Size
- Reject Invalid Files

---

### Image Processing (Optional)

- Rename File
- Generate Unique Filename
- Compress Image
- Resize Image

---

### Storage

- Local Storage
- Cloud Storage (Cloudinary / S3)

---

### Security

- Allow Image Files Only
- Prevent Duplicate Filename
- Validate MIME Type

---

## APIs

The upload module is not implemented yet. There is currently no upload route,
controller, service, or storage integration in the backend.

- POST /upload/image
- DELETE /upload/image/:filename

OR

- POST /products/:id/image
- DELETE /products/:id/image
