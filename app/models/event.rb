class Event < ApplicationRecord
  include ImageUrl

  enum event_type: [:banner, :in_page]
  ransacker :event_type, formatter: proc {|v| event_types[v]}
end
