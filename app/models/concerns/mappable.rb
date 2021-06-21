module Mappable
  extend ActiveSupport::Concern
  included do
    acts_as_mappable
    # before_save :set_lat_lng
  end

  def distance from_user
    distance = from_user.distance_to(self)
    if distance > 9
      from_user.distance_to(self).round
    else
      (from_user.distance_to(self)*10).round / 10.0
    end
  end

  # def set_lat_lng
  #   if address1.present?
  #     response = HTTParty.get("https://dapi.kakao.com/v2/local/search/address.json?query=#{URI.encode_www_form([address1])}", headers: {"Authorization" => "KakaoAK 87522e58436c9134460e8f0e87a8b4eb"})
  #     if address_document = response["documents"][0]
  #       self.lat = address_document["y"]
  #       self.lng = address_document["x"]
  #     end
  #   end
  # end

  # def shorten_address
  #   self.address1.split(' ')[0] + ' ' + self.address1.split(' ')[1] rescue ""
  # end
end
