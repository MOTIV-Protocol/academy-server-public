require 'test_helper'

class V1::LikesControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get v1_likes_create_url
    assert_response :success
  end

  test "should get destroy" do
    get v1_likes_destroy_url
    assert_response :success
  end

end
