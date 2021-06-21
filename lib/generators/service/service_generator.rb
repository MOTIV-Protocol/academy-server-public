class ServiceGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)

  def generate_controller
    template "service.rb", "app/services/#{name}_service.rb"
    template "test.rb", "test/services/#{name}_service_test.rb"
  end

  private

  def service_name
    if name.pluralize.singularize == name
      "#{name.classify}"
    else
      "#{name.classify}s"
    end
  end
end
