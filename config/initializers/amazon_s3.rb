# Default S3 host

AWS.config(
  :access_key_id     => Keys.aws_access_key_id,
  :secret_access_key => Keys.aws_secret_access_key,
  :region => Rails.configuration.s3_region
)

s3 = AWS::S3.new