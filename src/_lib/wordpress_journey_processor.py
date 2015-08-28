import sys
import json
import os.path
import requests
import dateutil.parser


def posts_at_url(url):

    current_page = 1
    max_page = sys.maxint

    while current_page <= max_page:
        url = os.path.expandvars(url)
        resp = requests.get(url, params={'page': current_page, 'count': '-1'})
        results = json.loads(resp.content)
        current_page += 1
        max_page = results['pages']
        for p in results['posts']:
            yield p


def documents(name, url, **kwargs):

    for post in posts_at_url(url):
        yield process_journey(post)


def process_journey(item):

    del item['comments']
    del item['date']
    custom_fields = item['custom_fields']
    item['_id'] = item['slug']

    if item['parent'] != 0:
        # This is a step item
        item['has_parent'] = True
        for name in ['what_to_know', 'what_to_do_now', 'pitfalls_to_avoid']:
            if custom_fields.get(name):
                item[name] = custom_fields[name]
        if custom_fields.get('key_tool'):
            if 'url' in custom_fields['key_tool'] or \
               'label' in custom_fields['key_tool']:
                item['key_tool'] = custom_fields['key_tool']
            else:
                item['key_tool'] = {'url': custom_fields['key_tool'][0],
                                    'label': custom_fields['key_tool'][1]}

        if 'collapse_link' in custom_fields:
            item['collapse_link'] = custom_fields['collapse_link']
        else:
            item['collapse_link'] = ''

    else:
        # This is a phase item
        item['has_parent'] = False

        if 'tools' in custom_fields:
            item['tools'] = custom_fields['tools']
        else:
            # create list of tools
            item['tools'] = []
            for x in range(3):
                tool = {}
                fields = ['description', 'link']
                for field in fields:
                    field_name = 'tools_%s_%s' % (str(x), field)
                    if field_name in custom_fields:
                        if field == 'link':
                            tool[field] = \
                                {'url': custom_fields[field_name][0],
                                 'label': custom_fields[field_name][1]}
                        else:
                            tool[field] = custom_fields[field_name]

                if tool:
                    item['tools'].append(tool)

        if 'milestones' in custom_fields:
            item['milestones'] = custom_fields['milestones']
        else:
            # create list of milestones
            milestones = []
            for x in range(3):
                key = 'milestones_%s' % x
                if key in custom_fields:
                    milestones.append(custom_fields[key])

            if milestones:
                item['milestones'] = milestones

    del item['custom_fields']

    return {'_type': 'journey',
            '_id': item['slug'],
            '_source': item}
