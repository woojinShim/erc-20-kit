const RandomString = require('../common/MyUtil').RandomString;
const path = require('path');
const multer = require('multer');
const multerS3 = require('multer-s3');
const AWS = require('aws-sdk');
const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

var util = require('util');

// 이미지 저장경로, 파일명 세팅
const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: process.env.AWS_BUCKET + '/bbs', // 버킷 이름
		contentType: multerS3.AUTO_CONTENT_TYPE, // 자동을 콘텐츠 타입 세팅
		// acl: 'public-read', // 클라이언트에서 자유롭게 가용하기 위함
		key: (req, file, cb) => {

			_logger.debug(`UPLOAD == ${file.originalname}`);
		
			let extension = path.extname(file.originalname);
			cb(null, Date.now().toString() + RandomString(8) + extension);
		},
	}),
	limits: { fileSize: 200 * 1024 * 1024 }, // 용량 제한
});

module.exports = [upload, s3];

