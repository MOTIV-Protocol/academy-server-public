require 'test_helper'

class V1::CouponsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get v1_coupons_index_url
    assert_response :success
  end

  test "should get destroy" do
    get v1_coupons_destroy_url
    assert_response :success
  end

end
