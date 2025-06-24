<!-- default product listing -->
<x-caffelia-shop::products.carousel
    title="Men's Collections"
    :src="route('shop.api.products.index')"
    :navigation-link="route('shop.home.index')"
/>

<!-- category product listing -->
<x-caffelia-shop::products.carousel
    title="Men's Collections"
    :src="route('shop.api.products.index', ['category_id' => 1])"
    :navigation-link="route('shop.home.index')"
/>

<!-- featured product listing -->
<x-caffelia-shop::products.carousel
    title="Men's Collections"
    :src="route('shop.api.products.index', ['featured' => 1])"
    :navigation-link="route('shop.home.index')"
/>

<!-- new product listing -->
<x-caffelia-shop::products.carousel
    title="Men's Collections"
    :src="route('shop.api.products.index', ['new' => 1])"
    :navigation-link="route('shop.home.index')"
/>

<!-- basic/traditional form  -->
<x-caffelia-shop::form action="">
     
    <!-- Type E-mail -->
    <x-caffelia-shop::form.control-group>
        <x-caffelia-shop::form.control-group.label>
            Email
        </x-caffelia-shop::form.control-group.label>

        <x-caffelia-shop::form.control-group.control
            type="email"
            name="email"
            rules="required|email"
            value=""
            label="Email"
            placeholder="email@example.com"
        />

        <x-caffelia-shop::form.control-group.error control-name="email" />
    </x-caffelia-shop::form.control-group>

    <!-- Type Date -->
    <x-caffelia-shop::form.control-group>
        <x-caffelia-shop::form.control-group.label>
            Date of Birth
        </x-caffelia-shop::form.control-group.label>

        <x-caffelia-shop::form.control-group.control
            type="date"
            id="dob"
            name="date_of_birth" 
            value=""
            label="Date of Birth"
            placeholder="Date of Birth"
        />

        <x-caffelia-shop::form.control-group.error control-name="date_of_birth" />
    </x-caffelia-shop::form.control-group>

    <!-- Type Date Time -->
    <x-caffelia-shop::form.control-group>
        <x-caffelia-shop::form.control-group.label>
            Start Timing
        </x-caffelia-shop::form.control-group.label>

        <x-caffelia-shop::form.control-group.control
            type="datetime"
            id="starts_from"
            name="starts_from"
            value=""
            label="Start Timing"
            placeholder="Start Timing"
        />

        <x-caffelia-shop::form.control-group.error control-name="starts_from" />
    </x-caffelia-shop::form.control-group>

    <!-- Type Text -->
    <x-caffelia-shop::form.control-group>
        <x-caffelia-shop::form.control-group.label class="required">
            @lang('name')
        </x-caffelia-shop::form.control-group.label>

        <x-caffelia-shop::form.control-group.control
            type="text"
            name="name"
            rules="required"
            :value=""
            label="name"
            placeholder="name"
        />

        <x-caffelia-shop::form.control-group.error control-name="name" />
    </x-caffelia-shop::form.control-group>

    <!-- Type Select -->
    <x-caffelia-shop::form.control-group>
        <x-caffelia-shop::form.control-group.label>
            @lang('caffelia-shop::app.catalog.families.create.column')
        </x-caffelia-shop::form.control-group.label>

        <x-caffelia-shop::form.control-group.control
            type="select"
            name="column"
            rules="required"
            :label="trans('caffelia-shop::app.catalog.families.create.column')"
        >
            <!-- Default Option -->
            <option value="">
                @lang('caffelia-shop::app.catalog.families.create.select-group')
            </option>

            <option value="1">
                @lang('caffelia-shop::app.catalog.families.create.main-column')
            </option>

            <option value="2">
                @lang('caffelia-shop::app.catalog.families.create.right-column')
            </option>
        </x-caffelia-shop::form.control-group.control>

        <x-caffelia-shop::form.control-group.error control-name="column" />
    </x-caffelia-shop::form.control-group>

    <!--Type Checkbox -->
    <x-caffelia-shop::form.control-group>
        <x-caffelia-shop::form.control-group.control
            type="checkbox"
            id="is_unique"
            name="is_unique"
            value="1"
            for="is_unique"
        />

        <x-caffelia-shop::form.control-group.label for="is_unique">
            @lang('caffelia-shop::app.catalog.attributes.edit.is-unique')
        </x-caffelia-shop::form.control-group.label>
    </x-caffelia-shop::form.control-group>

    <!--Type Radio -->
    <x-caffelia-shop::form.control-group>
        <x-caffelia-shop::form.control-group.control
            type="radio"
            id="is_unique"
            name="is_unique"
            value="1"
            for="is_unique"
        />

        <x-caffelia-shop::form.control-group.label for="is_unique" />
            @lang('caffelia-shop::app.catalog.attributes.edit.is-unique')
        </x-caffelia-shop::form.control-group.label>
    </x-caffelia-shop::form.control-group>

    <!-- Type Tinymce -->
    <x-caffelia-shop::form.control-group>
        <x-caffelia-shop::form.control-group.label>
            Description
        </x-caffelia-shop::form.control-group.label>

        <x-caffelia-shop::form.control-group.control
            type="textarea"
            class="description"
            name="description"
            rules="required"
            :value=""
            label="Description"
            :tinymce="true"
        />

        <x-caffelia-shop::form.control-group.error control-name="description" />
    </x-caffelia-shop::form.control-group>
</x-caffelia-shop::form>

<!-- customized/ajax form -->
<x-caffelia-shop::form
    v-slot="{ meta, errors, handleSubmit }"
    as="div"
>
    <form @submit="handleSubmit($event, callMethodInComponent)">
        <x-caffelia-shop::form.control-group>
            <x-caffelia-shop::form.control-group.label>
                Email
            </x-caffelia-shop::form.control-group.label>

            <x-caffelia-shop::form.control-group.control
                type="email"
                name="email"
                rules="required"
                :value="old('email')"
                label="Email"
                placeholder="email@example.com"
            />

            <x-caffelia-shop::form.control-group.error control-name="email" />
        </x-caffelia-shop::form.control-group>

        <button>Submit</button>
    </form>
</x-caffelia-shop::form>

<!-- Shimmer -->
<x-caffelia-shop::shimmer.checkout.onepage.payment-method />

<!-- tabs -->
<x-caffelia-shop::tabs>
    <x-caffelia-shop::tabs.item
        title="Tab 1"
    >
        Tab 1 Content
    </x-caffelia-shop::tabs.item>

    <x-caffelia-shop::tabs.item
        title="Tab 2"
    >
        Tab 2 Content
    </x-caffelia-shop::tabs.item>
</x-caffelia-shop::tabs>

<!-- accordion -->
<x-caffelia-shop::accordion>
    <x-slot:header>
        Accordion Header
    </x-slot>

    <x-slot:content>
        Accordion Content
    </x-slot>
</x-caffelia-shop::accordion>

<!-- modal -->
<x-caffelia-shop::modal>
    <x-slot:toggle>
        Modal Toggle
    </x-slot>

    <x-slot:header>
        Modal Header
    </x-slot>

    <x-slot:content>
        Modal Content
    </x-slot>
</x-caffelia-shop::modal>

<!-- drawer -->
<x-caffelia-shop::drawer>
    <x-slot:toggle>
        Drawer Toggle
    </x-slot>

    <x-slot:header>
        Drawer Header
    </x-slot>

    <x-slot:content>
        Drawer Content
    </x-slot>
</x-caffelia-shop::drawer>

<!-- dropdown -->
<x-caffelia-shop::dropdown>
    <x-slot:toggle>
        Toogle
    </x-slot>

    <x-slot:content>
        Content
    </x-slot>
</x-caffelia-shop::dropdown>

<!--Range Slider -->
<x-caffelia-shop::range-slider
    ::key="refreshKey"
    default-type="price"
    ::default-allowed-max-range="allowedMaxPrice"
    ::default-min-range="minRange"
    ::default-max-range="maxRange"
    @change-range="setPriceRange($event)"
/>

<!-- Image/Media -->
<x-caffelia-shop::media.images.lazy
    class="after:content-[' '] relative min-w-[250px] bg-zinc-100 transition-all duration-300 after:block after:pb-[calc(100%+9px)] group-hover:scale-105"
    ::src="product.base_image.medium_image_url"
    ::key="product.id"
    ::index="product.id"
    width="291"
    height="300"
    ::alt="product.name"
/>

<!-- Page Title -->
<x-slot:title>
    @lang('Title')
</x-slot>

<!-- Page Layout -->
<x-caffelia-shop::layouts>
   Page Content 
</x-caffelia-shop::layouts>

<!-- label class -->

<div class="label-canceled"></div>

<div class="label-info"></div>

<div class="label-completed"></div>

<div class="label-closed"></div>

<div class="label-processing"></div>

<div class="label-pending"></div>