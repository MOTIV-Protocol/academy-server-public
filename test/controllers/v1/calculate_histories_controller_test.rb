require 'test_helper'

class V1::CalculateHistoriesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get v1_calculate_histories_index_url
    assert_response :success
  end

end
