require 'test_helper'

class V1::LineItemsControllerTest < ActionDispatch::IntegrationTest
  test "should get create" do
    get v1_line_items_create_url
    assert_response :success
  end

end
