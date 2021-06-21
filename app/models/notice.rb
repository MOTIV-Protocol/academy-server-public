class Notice < ApplicationRecord
  paginates_per 5
  is_impressionable counter_cache: true, column_name: :view_count, unique: :ip_address
end
