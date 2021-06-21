class SerializerGenerator < Rails::Generators::NamedBase
  source_root File.expand_path('templates', __dir__)

  def generate_controller
    template "serializer.rb", "app/serializers/#{name}_serializer.rb"
  end

  private

  def model_name
    name.split('/').last.classify
  end

  def model_constant
    model_name.constantize
  end

  def attributes
    model_constant.columns.map(&:name)
  end

  def serializer_name
    if name.pluralize.singularize == name
      "#{name.classify}"
    else
      "#{name.classify}s"
    end
  end

  def version
    name.include?('/') ? (name.split('/').first.upcase + '::') : ''
  end
end
