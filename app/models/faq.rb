class Faq < ApplicationRecord

  # 회원가입 바로결제 리뷰관리 이용문의 불편문의 기타
  enum classification: [:to_register, :to_order, :to_review, :to_use, :to_complain, :etc]
  ransacker :classification, formatter: proc {|v| classifications[v]}

end
