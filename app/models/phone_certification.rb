class PhoneCertification < ApplicationRecord
  def check_code received_code = nil
    success = false
    msg = '인증번호가 올바르지 않습니다'
    if ((Time.current - self.updated_at)/60).to_i >= 3
      msg = '인증시간이 초과되었습니다'
    else
      if self.code == received_code
        self.update(confirmed_at: Time.now)
        success = true
        msg = '인증에 성공하셨습니다'
      end
    end
    return {type: "check_code", success: success, message: msg}
  end

  def self.generate_code phone = nil #인증코드 생성
    certification_code = self.find_or_create_by(phone: phone)
    generated_code = rand(999999).to_s.rjust(6, "0")
    success = false
    if certification_code.update(code: generated_code) #0 포함 6자리
      sms_message = SmsService.new(phone) #코드 발송
      success = sms_message.send_sms("인증번호 : [#{generated_code}]")
    end
    return {type: "generate_code", success: success}
  end
end