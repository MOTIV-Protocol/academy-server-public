class <%= service_name %>Service
  attr_reader :<%= name %>

  def initialize(<%= name %>_id)
    @<%= name %> = build_<%= name %>(<%= name %>_id)
  end

  def build_<%= name %>(<%= name %>_id)

  end
end
