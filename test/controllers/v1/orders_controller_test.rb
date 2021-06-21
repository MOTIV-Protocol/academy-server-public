require 'test_helper'

class V1::OrdersControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get v1_orders_index_url
    assert_response :success
  end

  test "should get show" do
    get v1_orders_show_url
    assert_response :success
  end

  test "should get new" do
    get v1_orders_new_url
    assert_response :success
  end

end
