var AttributeModRegistry;
(function (AttributeModRegistry) {
    var registry = new java.util.HashMap();
    var typeRegistry = new java.util.HashMap();
    function register(id, type, generator) {
        id = id.toLowerCase();
        if (registry.containsKey(id))
            throw new java.lang.IllegalArgumentException("Duplicate entry for '" + id + "'!");
        registry.put(id, generator);
        typeRegistry.put(id, type);
    }
    AttributeModRegistry.register = register;
    function getId(mod) {
        if (mod == null)
            return null;
        var inversedTypeRegistry;
        var iter = typeRegistry.entrySet().iterator();
        while (iter.hasNext()) {
            var entry = iter.next();
            inversedTypeRegistry.put(entry.getValue(), entry.getKey());
        }
        return inversedTypeRegistry.get(mod.getClass());
    }
    AttributeModRegistry.getId = getId;
    function create(id, value) {
        id = id.toLowerCase();
        return registry.containsKey(id) ? registry.get(id).apply(this, value) : null;
    }
    AttributeModRegistry.create = create;
})(AttributeModRegistry || (AttributeModRegistry = {}));
